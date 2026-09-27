from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class EntityType(str, Enum):
    PERSON = "Person"
    ORGANIZATION = "Organization"
    ROLE = "Role"
    PROJECT = "Project"
    TECHNOLOGY = "Technology"
    SKILL = "Skill"
    COURSE = "Course"
    CONCEPT = "Concept"
    INTEREST = "Interest"
    LOCATION = "Location"
    LANGUAGE = "Language"
    SYSTEM = "System"
    DATASET = "Dataset"
    METHOD = "Method"


class EntityExtraction(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=1, description="Canonical entity name supported by the source")
    entity_type: EntityType
    description: str = Field(min_length=1, description="Short source-grounded description")
    aliases: list[str] = Field(description="Aliases explicitly present in the source; use an empty list if none")


class RelationshipExtraction(BaseModel):
    model_config = ConfigDict(extra="forbid")

    source_entity: str = Field(min_length=1)
    target_entity: str = Field(min_length=1)
    relationship_type: str = Field(pattern=r"^[A-Z][A-Z0-9_]*$")
    description: str = Field(min_length=1, description="Short description of the supported fact")


class ChunkExtraction(BaseModel):
    model_config = ConfigDict(extra="forbid")

    entities: list[EntityExtraction]
    relationships: list[RelationshipExtraction]


def reject_unresolved_relationships(
    extraction: ChunkExtraction,
) -> tuple[ChunkExtraction, list[RelationshipExtraction]]:
    """Reject individual relationships whose endpoints were not extracted."""
    names = {
        value.strip().casefold()
        for entity in extraction.entities
        for value in [entity.name, *entity.aliases]
    }
    accepted: list[RelationshipExtraction] = []
    rejected: list[RelationshipExtraction] = []
    for relationship in extraction.relationships:
        endpoints_are_present = (
            relationship.source_entity.strip().casefold() in names
            and relationship.target_entity.strip().casefold() in names
        )
        (accepted if endpoints_are_present else rejected).append(relationship)

    return extraction.model_copy(update={"relationships": accepted}), rejected

from pathlib import Path


DATASET_ID = "ted-personal-kb-v1"
DOCUMENT_TITLE = "Teddy Agustinus Canonical Personal Knowledge Base"
REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE_PATH = REPOSITORY_ROOT / "data" / "personal_knowledge.md"
SOURCE_FILE_LABEL = "data/personal_knowledge.md"

ENTITY_TYPES = (
    "Person",
    "Organization",
    "Role",
    "Project",
    "Technology",
    "Skill",
    "Course",
    "Concept",
    "Interest",
    "Location",
    "Language",
    "System",
    "Dataset",
    "Method",
)

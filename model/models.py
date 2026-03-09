from datetime import datetime
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

class ExperimentData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    scenario_name: str
    category_name: str
    case_name: str
    button_clicked: str
    reaction_time_ms: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
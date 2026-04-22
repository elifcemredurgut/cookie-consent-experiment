import time
from typing import Optional, List, Dict
from sqlmodel import Field, SQLModel, Relationship

class ExperimentData(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    scenario_name: str
    category_name: str
    case_name: str
    button_clicked: str
    reaction_time_ms: float
    timestamp: float = Field(default_factory=time.time)
    preferences: Optional[str] = None

class ExperimentState(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    scenario_name: str
    case_name: str
    page_name: str
    scroll_y: int
    timestamp: float = Field(default_factory=time.time)

class CustomizeClicks(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    scenario_name: str
    case_name: str
    element_id: str        # e.g., "2_advertising_legitimate" or "arrow2"
    interaction_type: str  # e.g., "toggle_on", "toggle_off", "expand", "collapse"
    timestamp: float = Field(default_factory=time.time)
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.db_models import ContactMessageDB

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str
    subject: Optional[str] = None


class ContactResponse(BaseModel):
    success: bool
    message: str
    id: Optional[int] = None


@router.post(
    "",
    response_model=ContactResponse,
    summary="Submit and store a contact message",
    description="Saves a new user message into Neon PostgreSQL database.",
)
async def submit_contact_message(
    payload: ContactRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        msg = ContactMessageDB(
            name=payload.name.strip(),
            email=str(payload.email).strip().lower(),
            message=payload.message.strip(),
            subject=payload.subject.strip() if payload.subject else None,
        )
        db.add(msg)
        await db.commit()
        await db.refresh(msg)
        logger.info(f"Saved contact message #{msg.id} from {payload.name} ({payload.email})")
        return ContactResponse(
            success=True,
            message="Mesajınız başarıyla kaydedildi.",
            id=msg.id,
        )
    except Exception as e:
        logger.error(f"Error saving contact message: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Mesaj kaydedilirken bir hata oluştu.",
        )

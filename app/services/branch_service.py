from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.branch import Branch, BranchContact
from app.schemas.branch import BranchCreate, BranchUpdate, BranchContactCreate


def list_branches(db: Session, status_filter: str | None = None) -> list[Branch]:
    query = db.query(Branch)
    if status_filter:
        query = query.filter(Branch.status == status_filter)
    return query.order_by(Branch.display_order.asc(), Branch.id.asc()).all()


def get_branch_by_id(db: Session, branch_id: int) -> Branch:
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Branch not found")
    return branch


def create_branch(db: Session, data: BranchCreate) -> Branch:
    contacts_data = data.contacts
    branch_dict = data.model_dump(exclude={"contacts"})
    branch = Branch(**branch_dict)
    db.add(branch)
    db.flush()

    for c in contacts_data:
        contact = BranchContact(branch_id=branch.id, **c.model_dump())
        db.add(contact)

    db.commit()
    db.refresh(branch)
    return branch


def update_branch(db: Session, branch_id: int, data: BranchUpdate) -> Branch:
    branch = get_branch_by_id(db, branch_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(branch, field, value)
    db.commit()
    db.refresh(branch)
    return branch


def delete_branch(db: Session, branch_id: int) -> None:
    branch = get_branch_by_id(db, branch_id)
    db.delete(branch)
    db.commit()


def add_branch_contact(db: Session, branch_id: int, data: BranchContactCreate) -> BranchContact:
    get_branch_by_id(db, branch_id)
    contact = BranchContact(branch_id=branch_id, **data.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


def delete_branch_contact(db: Session, contact_id: int) -> None:
    contact = db.query(BranchContact).filter(BranchContact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    db.delete(contact)
    db.commit()

"""create website content tables

Revision ID: c7e8d9f1a2b3
Revises: bd63bbaf0dbd
Create Date: 2026-08-08 13:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c7e8d9f1a2b3'
down_revision: Union[str, Sequence[str], None] = 'bd63bbaf0dbd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # company_info
    op.create_table(
        'company_info',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('logo', sa.String(length=500), nullable=True),
        sa.Column('favicon', sa.String(length=500), nullable=True),
        sa.Column('tagline', sa.String(length=255), nullable=True),
        sa.Column('short_description', sa.Text(), nullable=True),
        sa.Column('full_description', sa.Text(), nullable=True),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('whatsapp', sa.String(length=50), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('google_maps_url', sa.Text(), nullable=True),
        sa.Column('working_hours', sa.String(length=255), nullable=True),
        sa.Column('facebook', sa.String(length=255), nullable=True),
        sa.Column('instagram', sa.String(length=255), nullable=True),
        sa.Column('linkedin', sa.String(length=255), nullable=True),
        sa.Column('youtube', sa.String(length=255), nullable=True),
        sa.Column('twitter', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # home_hero
    op.create_table(
        'home_hero',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('subtitle', sa.String(length=255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('button_text', sa.String(length=100), nullable=True),
        sa.Column('button_url', sa.String(length=255), nullable=True),
        sa.Column('background_image', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # company_statistics
    op.create_table(
        'company_statistics',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('label', sa.String(length=100), nullable=False),
        sa.Column('value', sa.String(length=50), nullable=False),
        sa.Column('icon', sa.String(length=100), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # about_us
    op.create_table(
        'about_us',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('page_title', sa.String(length=255), nullable=False),
        sa.Column('short_description', sa.Text(), nullable=True),
        sa.Column('company_story', sa.Text(), nullable=True),
        sa.Column('mission', sa.Text(), nullable=True),
        sa.Column('vision', sa.Text(), nullable=True),
        sa.Column('core_values', sa.Text(), nullable=True),
        sa.Column('about_image', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # services
    op.create_table(
        'services',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('short_description', sa.Text(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(length=100), nullable=True),
        sa.Column('image', sa.String(length=500), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('meta_title', sa.String(length=255), nullable=True),
        sa.Column('meta_description', sa.Text(), nullable=True),
        sa.Column('og_title', sa.String(length=255), nullable=True),
        sa.Column('og_description', sa.Text(), nullable=True),
        sa.Column('og_image', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('services', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_services_slug'), ['slug'], unique=True)

    # gallery_items
    op.create_table(
        'gallery_items',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('gallery_items', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_gallery_items_category'), ['category'], unique=False)

    # blogs
    op.create_table(
        'blogs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('short_description', sa.Text(), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('featured_image', sa.String(length=500), nullable=True),
        sa.Column('author', sa.String(length=100), nullable=False, server_default='Admin'),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('tags', sa.String(length=255), nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'PUBLISHED', 'ARCHIVED', name='blogstatus', native_enum=False), nullable=False, server_default='DRAFT'),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('published_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('meta_title', sa.String(length=255), nullable=True),
        sa.Column('meta_description', sa.Text(), nullable=True),
        sa.Column('og_title', sa.String(length=255), nullable=True),
        sa.Column('og_description', sa.Text(), nullable=True),
        sa.Column('og_image', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('blogs', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_blogs_slug'), ['slug'], unique=True)
        batch_op.create_index(batch_op.f('ix_blogs_category'), ['category'], unique=False)

    # faqs
    op.create_table(
        'faqs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('question', sa.String(length=500), nullable=False),
        sa.Column('answer', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('faqs', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_faqs_category'), ['category'], unique=False)

    # contact_messages
    op.create_table(
        'contact_messages',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('subject', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.Enum('NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'SPAM', name='contactstatus', native_enum=False), nullable=False, server_default='NEW'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('contact_messages')
    with op.batch_alter_table('faqs', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_faqs_category'))
    op.drop_table('faqs')
    with op.batch_alter_table('blogs', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_blogs_category'))
        batch_op.drop_index(batch_op.f('ix_blogs_slug'))
    op.drop_table('blogs')
    with op.batch_alter_table('gallery_items', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_gallery_items_category'))
    op.drop_table('gallery_items')
    with op.batch_alter_table('services', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_services_slug'))
    op.drop_table('services')
    op.drop_table('about_us')
    op.drop_table('company_statistics')
    op.drop_table('home_hero')
    op.drop_table('company_info')

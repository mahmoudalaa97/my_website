import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1703000000000 implements MigrationInterface {
  name = 'InitialSchema1703000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "admin_role_enum" AS ENUM ('super_admin', 'admin', 'editor', 'viewer')
    `);

    await queryRunner.query(`
      CREATE TYPE "media_type_enum" AS ENUM ('image', 'document', 'video')
    `);

    await queryRunner.query(`
      CREATE TYPE "storage_provider_enum" AS ENUM ('local', 's3', 'cloudinary')
    `);

    // Create admins table
    await queryRunner.query(`
      CREATE TABLE "admins" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying,
        "name" character varying NOT NULL,
        "role" "admin_role_enum" NOT NULL DEFAULT 'viewer',
        "is_active" boolean NOT NULL DEFAULT true,
        "invite_token" character varying,
        "invite_expires_at" TIMESTAMP,
        "last_login_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_admins_email" UNIQUE ("email"),
        CONSTRAINT "PK_admins" PRIMARY KEY ("id")
      )
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "admin_id" uuid NOT NULL,
        "action" character varying NOT NULL,
        "entity" character varying,
        "entity_id" character varying,
        "changes" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_audit_logs_admin" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE
      )
    `);

    // Create site_settings table
    await queryRunner.query(`
      CREATE TABLE "site_settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "site_name" character varying NOT NULL DEFAULT 'Your Business Name',
        "tagline" character varying NOT NULL DEFAULT 'Your Tagline Here',
        "description" text NOT NULL DEFAULT '',
        "logo_url" character varying NOT NULL DEFAULT '',
        "logo_dark_url" character varying NOT NULL DEFAULT '',
        "favicon_url" character varying NOT NULL DEFAULT '',
        "primary_color" character varying NOT NULL DEFAULT '#0ea5e9',
        "secondary_color" character varying NOT NULL DEFAULT '#6366f1',
        "accent_color" character varying NOT NULL DEFAULT '#8b5cf6',
        "background_color" character varying NOT NULL DEFAULT '#09090b',
        "foreground_color" character varying NOT NULL DEFAULT '#fafafa',
        "font_family" character varying NOT NULL DEFAULT 'Inter',
        "font_heading" character varying NOT NULL DEFAULT 'Inter',
        "seo_title" character varying NOT NULL DEFAULT '%s | Your Business',
        "seo_description" text NOT NULL DEFAULT '',
        "seo_keywords" character varying NOT NULL DEFAULT '',
        "og_image_url" character varying NOT NULL DEFAULT '',
        "google_analytics_id" character varying NOT NULL DEFAULT '',
        "plausible_domain" character varying NOT NULL DEFAULT '',
        "hero_title" character varying NOT NULL DEFAULT 'Welcome to Our Website',
        "hero_subtitle" text NOT NULL DEFAULT '',
        "hero_badge" character varying NOT NULL DEFAULT 'Professional Services',
        "hero_cta_primary" character varying NOT NULL DEFAULT 'Our Services',
        "hero_cta_secondary" character varying NOT NULL DEFAULT 'Contact Us',
        "about_title" character varying NOT NULL DEFAULT 'About Us',
        "about_description" text NOT NULL DEFAULT '',
        "about_image_url" character varying NOT NULL DEFAULT '',
        "email" character varying NOT NULL DEFAULT '',
        "phone" character varying NOT NULL DEFAULT '',
        "whatsapp" character varying NOT NULL DEFAULT '',
        "location" character varying NOT NULL DEFAULT '',
        "social_links" jsonb NOT NULL DEFAULT '{}',
        "stats" jsonb NOT NULL DEFAULT '[]',
        "footer_text" character varying NOT NULL DEFAULT '',
        "copyright_text" character varying NOT NULL DEFAULT '© {year} {siteName}. All rights reserved.',
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_site_settings" PRIMARY KEY ("id")
      )
    `);

    // Create services table
    await queryRunner.query(`
      CREATE TABLE "services" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "icon" character varying NOT NULL DEFAULT 'Briefcase',
        "features" jsonb NOT NULL DEFAULT '[]',
        "sort_order" integer NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_services" PRIMARY KEY ("id")
      )
    `);

    // Create packages table
    await queryRunner.query(`
      CREATE TABLE "packages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "price_note" character varying,
        "features" jsonb NOT NULL DEFAULT '[]',
        "is_popular" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_packages" PRIMARY KEY ("id")
      )
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "image_url" character varying,
        "tags" jsonb NOT NULL DEFAULT '[]',
        "live_url" character varying,
        "github_url" character varying,
        "is_featured" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projects" PRIMARY KEY ("id")
      )
    `);

    // Create contact_messages table
    await queryRunner.query(`
      CREATE TABLE "contact_messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "project_type" character varying,
        "budget" character varying,
        "message" text NOT NULL,
        "is_read" boolean NOT NULL DEFAULT false,
        "is_archived" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contact_messages" PRIMARY KEY ("id")
      )
    `);

    // Create media table
    await queryRunner.query(`
      CREATE TABLE "media" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "filename" character varying NOT NULL,
        "original_name" character varying NOT NULL,
        "mime_type" character varying NOT NULL,
        "size" integer NOT NULL,
        "url" character varying NOT NULL,
        "thumbnail_url" character varying,
        "type" "media_type_enum" NOT NULL DEFAULT 'image',
        "provider" "storage_provider_enum" NOT NULL DEFAULT 'local',
        "folder" character varying,
        "alt_text" character varying,
        "uploaded_by" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_media" PRIMARY KEY ("id"),
        CONSTRAINT "FK_media_admin" FOREIGN KEY ("uploaded_by") REFERENCES "admins"("id") ON DELETE SET NULL
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_admins_email" ON "admins" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_audit_logs_admin_id" ON "audit_logs" ("admin_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_audit_logs_created_at" ON "audit_logs" ("created_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_services_sort_order" ON "services" ("sort_order")`);
    await queryRunner.query(`CREATE INDEX "IDX_packages_sort_order" ON "packages" ("sort_order")`);
    await queryRunner.query(`CREATE INDEX "IDX_projects_sort_order" ON "projects" ("sort_order")`);
    await queryRunner.query(`CREATE INDEX "IDX_contact_messages_created_at" ON "contact_messages" ("created_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_media_folder" ON "media" ("folder")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_media_folder"`);
    await queryRunner.query(`DROP INDEX "IDX_contact_messages_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_sort_order"`);
    await queryRunner.query(`DROP INDEX "IDX_packages_sort_order"`);
    await queryRunner.query(`DROP INDEX "IDX_services_sort_order"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_admin_id"`);
    await queryRunner.query(`DROP INDEX "IDX_admins_email"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TABLE "contact_messages"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "packages"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "site_settings"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "admins"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "storage_provider_enum"`);
    await queryRunner.query(`DROP TYPE "media_type_enum"`);
    await queryRunner.query(`DROP TYPE "admin_role_enum"`);
  }
}


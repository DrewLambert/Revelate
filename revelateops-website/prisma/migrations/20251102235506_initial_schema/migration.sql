-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "user_phone" VARCHAR(50) NOT NULL,
    "user_company" VARCHAR(255),
    "slack_thread_ts" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "sender" VARCHAR(10) NOT NULL,
    "message_text" TEXT NOT NULL,
    "sent_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "read_by_user" BOOLEAN DEFAULT false,
    "slack_ts" VARCHAR(50),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "short_description" VARCHAR(500),
    "full_description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "created_by" VARCHAR(255),
    "updated_by" VARCHAR(255),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "stage" VARCHAR(100),
    "target_arr_min" BIGINT,
    "target_arr_max" BIGINT,
    "tagline" VARCHAR(255),
    "short_description" VARCHAR(500),
    "full_description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "discount_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "timeline_weeks_min" DECIMAL(4,1),
    "timeline_weeks_max" DECIMAL(4,1),
    "icon" VARCHAR(50),
    "badge" VARCHAR(50),
    "inputs_description" TEXT,
    "delivery_rhythm_description" TEXT,
    "outputs_description" TEXT,
    "success_criteria_description" TEXT,
    "guarantee_description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "created_by" VARCHAR(255),
    "updated_by" VARCHAR(255),

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_services" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "package_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "is_core" BOOLEAN NOT NULL DEFAULT true,
    "quantity" DECIMAL(4,1) NOT NULL DEFAULT 1,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoping_factors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "package_id" UUID NOT NULL,
    "factor_key" VARCHAR(100) NOT NULL,
    "question_text" TEXT NOT NULL,
    "help_text" TEXT,
    "input_type" VARCHAR(50) NOT NULL,
    "options" JSONB,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "scoping_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scoping_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "package_id" UUID NOT NULL,
    "rule_name" VARCHAR(255) NOT NULL,
    "factor_key" VARCHAR(100) NOT NULL,
    "operator" VARCHAR(20) NOT NULL,
    "condition_value" JSONB NOT NULL,
    "price_adjustment_type" VARCHAR(20),
    "price_adjustment_value" DECIMAL(10,2),
    "timeline_adjustment_weeks" DECIMAL(4,2),
    "adjustment_label" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "scoping_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "user_email" VARCHAR(255),
    "phone" VARCHAR(50),
    "company_name" VARCHAR(255),
    "title" VARCHAR(255),
    "comments" TEXT,
    "package_id" UUID,
    "scoping_inputs" JSONB,
    "selected_services" JSONB,
    "calculated_price" DECIMAL(10,2),
    "calculated_timeline_weeks" DECIMAL(4,2),
    "pdf_url" VARCHAR(500),
    "status" VARCHAR(50) NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "table_name" VARCHAR(100) NOT NULL,
    "record_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "changed_fields" JSONB,
    "changed_by" VARCHAR(255) NOT NULL,
    "changed_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversations_slack_thread_ts_key" ON "conversations"("slack_thread_ts");

-- CreateIndex
CREATE INDEX "idx_conversations_slack_thread" ON "conversations"("slack_thread_ts");

-- CreateIndex
CREATE INDEX "idx_messages_conversation" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "idx_messages_sent_at" ON "messages"("sent_at");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_is_active_display_order_idx" ON "services"("is_active", "display_order");

-- CreateIndex
CREATE INDEX "services_category_idx" ON "services"("category");

-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "packages"("slug");

-- CreateIndex
CREATE INDEX "packages_is_active_type_display_order_idx" ON "packages"("is_active", "type", "display_order");

-- CreateIndex
CREATE INDEX "packages_stage_idx" ON "packages"("stage");

-- CreateIndex
CREATE UNIQUE INDEX "package_services_package_id_service_id_key" ON "package_services"("package_id", "service_id");

-- CreateIndex
CREATE INDEX "admin_audit_log_table_name_record_id_idx" ON "admin_audit_log"("table_name", "record_id");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "package_services" ADD CONSTRAINT "package_services_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_services" ADD CONSTRAINT "package_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoping_factors" ADD CONSTRAINT "scoping_factors_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scoping_rules" ADD CONSTRAINT "scoping_rules_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

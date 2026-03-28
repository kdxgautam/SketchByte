CREATE TABLE "customTemplates" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "customTemplates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"tags" json,
	"templateData" json,
	"commands" varchar,
	"createdBy" varchar
);

-- =================================================================================
-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" varchar DEFAULT 'BUYER'::character varying NOT NULL,
	date_created varchar DEFAULT now() NOT NULL,
	CONSTRAINT pk_users PRIMARY KEY (id),
	CONSTRAINT uq_users_email UNIQUE (email)
);

-- Insertamos el usuario con rol de ADMIN y con contraseña Proyecto-VII-2026
INSERT INTO public.users ("name",email,"password","role",date_created) VALUES
	 ('Administrador del sistema GDL-PLACE','admin.gdl-place@gdlplace.com','$2b$10$TiVUq84guf8W4GPXS5iLleoMlz/Ic/0PkozIc1MnqHp1b7tknSk8W','ADMIN','2026-03-14 14:28:46.683111-06');

-- =================================================================================
-- public.sellers definition

-- Drop table

-- DROP TABLE public.sellers;

CREATE TABLE public.sellers (
	id serial4 NOT NULL,
	bussines_name varchar(100) NOT NULL,
	owner_name varchar(100) NOT NULL,
	email varchar(100) NOT NULL,
	address varchar(100) NULL,
	phone varchar(50) NULL,
	city varchar(100) NOT NULL,
	category varchar(100) NOT NULL,
	description varchar NOT NULL,
	date_created timestamptz DEFAULT now() NULL,
	CONSTRAINT pk_sellers PRIMARY KEY (id),
	CONSTRAINT uq_sellers_email UNIQUE (email)
);

-- =================================================================================
-- public.categories definition

-- Drop table

-- DROP TABLE public.categories;

CREATE TABLE public.categories (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT pk_categories PRIMARY KEY (id),
	CONSTRAINT uq_categories_name UNIQUE (name)
);

-- =================================================================================
-- public.products definition

-- Drop table

-- DROP TABLE public.products;

-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	description text NULL,
	price numeric(10, 2) NOT NULL,
	category varchar(100) NULL,
	stock int4 NOT NULL,
	image varchar(255) NULL,
	seller_id int4 NOT NULL,
	seller_name varchar(100) NULL,
	shipping_time varchar(50) NULL,
	shipping_unit varchar(50) NULL,
	CONSTRAINT pk_products PRIMARY KEY (id)
);

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT
);

-- =================================================================================
-- public.sales definition

-- Drop table

-- DROP TABLE public.sales;

CREATE TABLE public.sales (
	id serial4 NOT NULL,
	product_id int4 NULL,
	product_name varchar(255) NULL,
	quantity int4 NOT NULL,
	total numeric(10, 2) NOT NULL,
	buyer_name varchar(100) NULL,
	buyer_email varchar(255) NULL,
	buyer_phone varchar(50) NULL,
	street varchar(255) NULL,
	city varchar(100) NULL,
	state varchar(100) NULL,
	zip_code varchar(20) NULL,
	country varchar(100) NULL,
	"date" date NULL,
	status varchar(20) NULL,
	tracking_number varchar(100) NULL,
	CONSTRAINT sales_pkey PRIMARY KEY (id),
	CONSTRAINT sales_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

-- =================================================================================
-- public.cart_items definition

-- Drop table

-- DROP TABLE public.cart_items;

CREATE TABLE public.cart_items (
	id serial4 NOT NULL,
    sale_id int4 NOT NULL;
	product_id int4 NULL,
	quantity int4 NOT NULL,
    price numeric(12,2) NOT NULL,
	CONSTRAINT cart_items_pkey PRIMARY KEY (id),
    CONSTRAINT cart_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id),
	CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

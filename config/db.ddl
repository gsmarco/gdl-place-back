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

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  seller_id INT NOT NULL,
  store_name VARCHAR(255),
  story_title VARCHAR(255),
  story_content TEXT,
  cover_image TEXT,
  gallery_images TEXT[], 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES sellers(id)
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

CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  total NUMERIC(10,2) NOT NULL,
  buyer_id INT,
  buyer_name VARCHAR(150),
  buyer_email VARCHAR(150),
  buyer_phone VARCHAR(50),
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  date_sale DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20),
  tracking_number VARCHAR(100)
);

-- =================================================================================
-- Drop table

-- DROP TABLE sale_products;
CREATE TABLE sale_products (
  id SERIAL PRIMARY KEY,
  sale_id INT REFERENCES sales(id) ON DELETE CASCADE,
  product_id INT,
  product_name VARCHAR(255),
  price NUMERIC(10,2),
  quantity INT,
  image VARCHAR(255)
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

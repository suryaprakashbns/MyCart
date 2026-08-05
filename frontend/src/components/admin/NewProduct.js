import React, { Fragment, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categories = ["Electronics", "Clothing", "Footwear", "Books", "Home", "Sports"];

const NewProduct = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const onImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);

        setImagesPreview([]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setImagesPreview((old) => [...old, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("price", price);
        formData.set("description", description);
        formData.set("category", category);
        formData.set("stock", stock);
        formData.set("seller", seller);
        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            await axios.post("/api/v1/admin/product/new", formData, config);
            navigate("/");
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <Fragment>
            <div className="wrapper">
                <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                    <h1 className="mb-4">New Product</h1>

                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">Select</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Stock</label>
                        <input type="number" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Seller Name</label>
                        <input type="text" className="form-control" value={seller} onChange={(e) => setSeller(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Images</label>
                        <div className="custom-file">
                            <input type="file" name="images" className="custom-file-input" multiple onChange={onImagesChange} />
                        </div>
                        {imagesPreview.map((img, i) => (
                            <img src={img} key={i} alt="preview" className="mt-3 mr-2" width="55" height="52" />
                        ))}
                    </div>

                    <button type="submit" className="btn btn-block py-3">CREATE</button>
                </form>
            </div>
        </Fragment>
    );
};

export default NewProduct;

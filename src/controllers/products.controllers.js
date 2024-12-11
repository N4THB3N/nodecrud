import { json } from 'express';
import {getConnection} from '../database/connection.js';
import sql from 'mssql';

export const getProducts = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Products');
    res.json(result.recordset);
};

export const getProduct = async (req, res) => {
        const id = req.params.id;
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Products WHERE Product_ID = ' + id );

        if(result.rowsAffected[0] == 0){
            return res.status(404).json({
                message: 'Product not found'
            })
        }

        return res.json(result.recordset[0]);
        
};

export const insertProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Name', sql.VarChar, req.body.Name)
        .input('Description', sql.Text, req.body.Description)
        .input('Price', sql.Decimal, req.body.Price)
        .input('Qty', sql.Int, req.body.Qty)
    
        .query('INSERT INTO Products(Name, Description, Price, Qty) VALUES (@Name, @Description, @Price, @Qty); SELECT SCOPE_IDENTITY() AS Product_ID');
        console.log(result);    
    res.json({Result:'Product save successfully on database', Product_ID: result.recordset[0].Product_ID, Name: req.body.Name})
};

export const updateProduct = async(req, res) => {
    const id = req.params.id;
    const pool = await getConnection();
    const result = await pool.request()
    .input("id", sql.Int, req.params.id)
    .input('Name', sql.VarChar, req.body.Name)
    .input('Description', sql.Text, req.body.Description)
    .input('Price', sql.Decimal, req.body.Price)
    .input('Qty', sql.Int, req.body.Qty)
    .query('UPDATE Products SET Name = @Name, Description = @Description, Qty = @Qty, Price = @Price WHERE Product_ID = @id');

    if(result.rowsAffected[0] == 0){
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    res.json('Product updated successfully')
};

export const deleteProduct = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input("Product_ID", sql.Int, req.params.id)
        .query("DELETE FROM Products WHERE Product_ID = @Product_ID");

        if(result.rowsAffected[0] == 0){
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        return res.json({message: 'Product deleted successfully', Product_ID: req.params.id});

};
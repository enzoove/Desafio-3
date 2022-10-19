const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

function between(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Contenedor
{
    constructor( fileName )
    {
        this.fileName = fileName;
    }

    async save( product ) //Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
    {
        try
        {
            const content = await fs.promises.readFile( this.fileName, 'utf-8' );
            const arrayContent = JSON.parse( content );
            
            const newProduct ={
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                ID: arrayContent[arrayContent.length-1].ID +1
            }
            arrayContent.push( newProduct );
            
            const data = JSON.stringify( arrayContent, null, '\t' );
            await fs.promises.writeFile( this.fileName,data ); 
        }
        catch(err)
        {
            console.log('Error', err );
        }
    }
    async getByID( ID_Clave) //Recibe un id y devuelve el objeto con ese id, o null si no está.
    {
        const content = await fs.promises.readFile( this.fileName, 'utf-8' );
        const arrayContent = JSON.parse( content );
        
        const indice = arrayContent.findIndex( (product) => product.ID === ID_Clave )

        if( indice>=0 )
        {
            return arrayContent[indice];
        }
        else
        {
            throw new Error( 'No se encontro el producto solicitado' );
        }
    
    }
    catch(err)
    {
        console.log(err);
    }
    
    async getAll() //Devuelve un array con los objetos presentes en el archivo.
    {
       try
       {
            const content = await fs.promises.readFile( this.fileName, 'utf-8' );
            return JSON.parse( content );
       }
       catch(err)
       {
            console.log(err);
       }
    }
    async deleteByID(ID_Clave) //Elimina del archivo el objeto con el id buscado.
    {
        try
        {
            const content = await fs.promises.readFile( this.fileName, 'utf-8' );
            const arrayContent = JSON.parse( content );
            
            const indice = arrayContent.findIndex( (product) => product.ID === ID_Clave )
            if( indice<0 )
            {
                return;
            }
            else
            {
                arrayContent.splice(indice,1);
                console.log( 'Producto eliminado correctamente' );
            }
            const data = JSON.stringify( arrayContent, null, '\t' );
            await fs.promises.writeFile( this.fileName, data );
        }
        catch(err)
        {
            console.log(err);
        }
    }
    async deleteAll() //Elimina todos los objetos presentes en el archivo.
    {
        try
        {
            await fs.promises.writeFile( this.fileName, '[]' );
            console.log( 'Productos eliminados correctamente' );
        }
        catch(err)
        {
            console.log(err);
        }

    }
    async getRandomProduct()//Devuelve un objeto aleratorio de los presentes en el archivo
    {
        try
        {
            const content = await fs.promises.readFile( this.fileName, 'utf-8' );
            const arrayContent = JSON.parse( content );
            const random = between( 0, arrayContent.length );
            return arrayContent[random];
        }
        catch(err)
        {
            console.log(err);
        }
    }
}
const container = new Contenedor( 'productos.json' );
const PORT = process.env.PORT || 8080;

const server = app.listen( PORT, ()=>{
    console.log( `Servidor escuchando en el puerto  ${server.address().port}` );
} )

app.get( '/productos',(req,res)=>{
    const products = container.getAll();
    res.send( products );
} )

app.get( '/productoRandom',(req,res)=>{
    const randomProduct = container.getRandomProduct();
    res.send( randomProduct );
} )

server.on('error', error => console.log( `Error en el servidor ${error}` ));
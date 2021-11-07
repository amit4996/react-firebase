
import './main.css';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs,query,where } from '@firebase/firestore';
import {db} from "./Firebaseconfig";
import Form from './Form';
import NewForm from './NewForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPlusCircle,faTrashAlt } from '@fortawesome/free-solid-svg-icons'


function App() {
 
  const [products,setProducts]=useState([])
  const usersCollectionRef=collection(db,"products")
  const [displayform,setDisplayForm]=useState(false)
  const [addnewproduct,setAddNewProduct]=useState(false)
  const [id,setid]=useState(0);
  const [datatobeupdated,setDataToBeUpdated]=useState({name:""});
  const [refresh,setrefresh]=useState(false)

  const AddNewProduct=()=>{
    setAddNewProduct(true);
  } 

  const refreshhandler=()=>{
    refresh?setrefresh(false):setrefresh(true)
  }

  const deleteProducts= async(id)=>{
    const productDoc=doc(db,"products",id)
    await deleteDoc(productDoc)
    refresh?setrefresh(false):setrefresh(true)
  }

  

  useEffect(()=>{
    const getProducts= async ()=>{
      const data= await getDocs(usersCollectionRef)
      setProducts(data.docs.map((doc)=>({...doc.data(),id:doc.id})))
    }
    getProducts();
    
   
  },[refresh])


  

  

 
  const closehandler=(e)=>{
    setDisplayForm(false)
  }
  const closehandlerNF=(e)=>{
    setAddNewProduct(false)
  }

   const editable=(id,data)=>{
    setDisplayForm(true)
    setid(id)
    setDataToBeUpdated({name:data.name,price:data.price,mrp:data.mrp,discount:data.discount,description:data.description,size:data.size,quantity:data.quantity,color:data.color,occassion:data.occassion,url:data.url})
   }

 




  const getfilteredProducts= async (e)=>{
    const q = query(usersCollectionRef, where("color", "==",e.target.value));
    const data= await getDocs(q)
    setProducts(data.docs.map((doc)=>({...doc.data(),id:doc.id})))
  }

  

  return (
    <div className="App">
      <button className="btnaddnew" onClick={()=>{AddNewProduct()}}><FontAwesomeIcon icon={faPlusCircle} />  Add New Product</button>
      
      <select className="select" onChange={getfilteredProducts} >
      
        <option selected>Sort By</option>
        <optgroup label="Color" >
        <option value="Oxygen Blue">Oxygen Blue</option>
        <option value="Cool Blue">Cool Blue</option>
        </optgroup>
      </select>

      <div className="cardcontainer">
         {products.map((product)=>{ return <div key={product.id} className="card">
        <div>
        <img src={product.url} alt="Product" />
        </div>
        <div>
          <h2>{product.name}</h2>
          <p className="desc"> <span>Description:</span> {product.description}</p>
          <p> <span>Size:</span> {product.size}</p>
          <p><span>Quantity:</span> {product.quantity}</p>
          <p><span>Color:</span> {product.color}</p>
          <p><span>Occassion:</span> {product.occassion}</p>
        </div>

        <div>
        <h4><span>Price: Rs </span> {product.price}</h4> 
        <p><span>MRP: Rs </span> <del>{product.mrp}</del></p>
        <p><span>Discount:</span> {product.discount}<span>%</span></p>
        </div>
        <div>
        <button className="btndelete" onClick={()=>{deleteProducts(product.id)}}><FontAwesomeIcon icon={faTrashAlt} /> Delete</button>
        <button className="btnedit" onClick={()=>{editable(product.id,{name:product.name,price:product.price,mrp:product.mrp,discount:product.discount,description:product.description,size:product.size,quantity:product.quantity,color:product.color,occassion:product.occassion,url:product.url})}}><FontAwesomeIcon icon={faEdit} /> Edit</button>
        </div>
        </div>})}
        </div>
        {displayform?<Form closehandler={closehandler} id={id} data={datatobeupdated} refreshhandler={refreshhandler} />:null}
        {addnewproduct?<NewForm closehandlerNF={closehandlerNF} refreshhandler={refreshhandler} />:null}

      
    </div>
  );
}

export default App;

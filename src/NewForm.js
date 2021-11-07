import {useState } from 'react';
import {db,storage} from "./Firebaseconfig"
import {collection,addDoc} from "@firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle,faTimesCircle, faUpload } from '@fortawesome/free-solid-svg-icons'
import {ref,getDownloadURL,uploadBytesResumable} from "firebase/storage"

const NewForm=({ClosehandlerNF,Refreshhandler})=>{

    const [newdata,setnewdata]=useState({name:"",price:null,mrp:null,discount:null,description:"",size:"",quantity:null,color:"",occassion:"",url:""})
    const [image,setimage]=useState(null)
    const usersCollectionRef=collection(db,"products")
    const [imgprogress,setimgprogress]=useState(0)
    const [alertmsg,setalertmsg]=useState(null)

    const handleimage=(e)=>{
        if(e.target.files[0])
        {
         if(e.target.files[0].size<=1048576)
         {
          setimage(e.target.files[0])
         }
         
        }
    }

     

    const handleimageupload=()=>{
        if(image)
        {
            
        const storageRef=ref(storage,`${image.name}`)
        const uploadTask=uploadBytesResumable(storageRef,image)
        
        uploadTask.on('state_changed',
  (snapshot) => {
     
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setimgprogress(progress)
        switch (snapshot.state) {
          case 'paused':
            break;
          case 'running':
            break;
            default:
        }
     
     
  }, 
  (error) => {
    switch (error.code) {
      case 'storage/unauthorized':
        break;
      case 'storage/canceled':
        break;
       case 'storage/unknown':
        break;
        default:
    }
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      setnewdata({...newdata,url:downloadURL})
     
    });
  }
);

        }
        else
        {
            setalertmsg("* Image size must not exceed 1 mb")
        }
    }


    const createProducts= async()=>{
        if(newdata.name && newdata.price && newdata.mrp && newdata.discount && newdata.description && newdata.size && newdata.quantity && newdata.color && newdata.occassion && newdata.url)
        {
          if(isNaN(newdata.price) || isNaN(newdata.mrp) || isNaN(newdata.discount) || isNaN(newdata.quantity))
           {
            setalertmsg("* Price/MRP/Discount/Quantity must be a number")
           }
           else
           {
             await addDoc(usersCollectionRef,{name:newdata.name,price:newdata.price,mrp:newdata.mrp,discount:newdata.discount,description:newdata.description,size:newdata.size,quantity:newdata.quantity,color:newdata.color,occassion:newdata.occassion,url:newdata.url})
            setnewdata({name:"",price:0,mrp:0,discount:0,description:"",size:"",quantity:0,color:"",occassion:"",url:""});
            ClosehandlerNF();
            Refreshhandler();
           }
        }
        else
        {
            setalertmsg("* Enter All Field");
        }
       }

   return(
       <div className="form">
           <div className="innerform">
                  <h3>Add New Product</h3>
                  <button className="btnclose" onClick={ClosehandlerNF}><FontAwesomeIcon icon={faTimesCircle} /></button>
              {alertmsg==null?null:<p className="alert">{alertmsg}</p>}
              <div className="inputcontainer">
              <div className="uploadcontainer">
              <input className="choosefile" type="file" name="url" onChange={handleimage}></input>
              <button className="btnaddnew" onClick={handleimageupload}> <FontAwesomeIcon icon={faUpload} /></button>
              
              </div>
              {imgprogress===100?<p className="uploadsuccessfull">Image Uploaded Successfully</p>:<p></p>}
              <input placeholder="Name" name="name"  value={newdata.name} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Price" type="number" name="price" value={newdata.price} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="MRP" type="number" name="mrp" value={newdata.mrp} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Discount" type="number" name="discount" value={newdata.discount} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Description" name="description" value={newdata.description} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Size" name="size" value={newdata.size} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Quantity" type="number" name="quantity" value={newdata.quantity} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input>
              
              {/* <input placeholder="Color" name="color" value={newdata.color} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input> */}
               
               <select className="selectcolor" name="color" onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}>
               <option selected>Select Color</option>
               <option value="Oxygen Blue">Oxygen Blue</option>
               <option value="Cool Blue">Cool Blue</option>
               </select>

              <input placeholder="Occassion" name="occassion" value={newdata.occassion} onChange={(e)=>{setnewdata({...newdata,[e.target.name]:e.target.value})}}></input>
              </div>

              <button className="btnaddnew" onClick={createProducts}><FontAwesomeIcon icon={faPlusCircle} /> Add New Product</button>
           </div>

       </div>
   )
}
export default NewForm;
import {useState } from 'react';
import {db,storage} from "./Firebaseconfig"
import {doc,updateDoc} from "@firebase/firestore"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle,faUpload } from '@fortawesome/free-solid-svg-icons'
import {ref,getDownloadURL,uploadBytesResumable} from "firebase/storage"

const Form=({Closehandler,id,data,Refreshhandler})=>{

    const [updateddata,setUpdatedData]=useState({name:data.name,price:data.price,mrp:data.mrp,discount:data.discount,description:data.description,size:data.size,quantity:data.quantity,color:data.color,occassion:data.occassion,url:data.url});
    const [imagenew,setimagenew]=useState(null)
    const [imagenewprogress,setimagenewprogress]=useState(0)

    const [alertmsg,setalertmsg]=useState(null)

    const handleimage=(e)=>{
        if(e.target.files[0])
        {
            if(e.target.files[0].size<=1048576)
         {
          setimagenew(e.target.files[0])
         }
        }
    }

     

    const handleimageupload=()=>{
        if(imagenew)
        {
            const storageRef=ref(storage,`${imagenew.name}`)
        const uploadTask=uploadBytesResumable(storageRef,imagenew)
        
        uploadTask.on('state_changed',
  (snapshot) => {
     if(snapshot.totalBytes<=1048576){
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setimagenewprogress(progress)
        switch (snapshot.state) {
          case 'paused':
            break;
          case 'running':
            break;
            default:
        }
     }
     else
     {
        setalertmsg("* Image size must not exceed 1 mb")
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
        setUpdatedData({...updateddata,url:downloadURL})
     
    });
  }
);
        }
        else
        {
            alert("Image size must not exceed 1 mb");
        }
    }
    
    const updateProducts= async()=>{
        if(isNaN(updateddata.price) || isNaN(updateddata.mrp) || isNaN(updateddata.discount) || isNaN(updateddata.quantity))
           {
            setalertmsg("* Price/MRP/Discount/Quantity must be a number")
           }
           else{
            const productDoc=doc(db,"products",id)
            await updateDoc(productDoc,{name:updateddata.name,price:updateddata.price,mrp:updateddata.mrp,discount:updateddata.discount,description:updateddata.description,size:updateddata.size,quantity:updateddata.quantity,color:updateddata.color,occassion:updateddata.occassion,url:updateddata.url})
            Closehandler();
            Refreshhandler();
           }
        
      }
   return(
       <div className="form">
           <div className="innerform">
              <h3>Edit Product Details</h3>
              <button className="btnclose" onClick={Closehandler}><FontAwesomeIcon icon={faTimesCircle} /></button>
              {alertmsg==null?null:<p className="alert">{alertmsg}</p>}
              <div className="inputcontainer">
              <div className="uploadcontainer">
              <input className="choosefile" type="file" name="url" onChange={handleimage}></input>
              <button className="btnaddnew" onClick={handleimageupload}><FontAwesomeIcon icon={faUpload} /></button>
              
              </div>
              {imagenewprogress===100?<p className="uploadsuccessfull">Image Uploaded Successfully</p>:<p></p>}
              <input  value={updateddata.name} name="name" onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Price" type="number" value={updateddata.price} name="price" onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="MRP"  type="number" value={updateddata.mrp} name="mrp"  onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Discount" type="number"  value={updateddata.discount}  name="discount" onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Description" value={updateddata.description} name="description" onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Size" value={updateddata.size} name="size" onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input>
              <input placeholder="Quantity" type="number" value={updateddata.quantity} name="quantity"  onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input>
             
              {/* <input placeholder="Color" value={updateddata.color} name="color" onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input> */}
    
              <select className="selectcolor" name="color" onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}>
               <option selected>Select Color</option>
               <option value="Oxygen Blue">Oxygen Blue</option>
               <option value="Cool Blue">Cool Blue</option>
               </select>

              <input placeholder="Occassion" value={updateddata.occassion} name="occassion" onChange={(e)=>{setUpdatedData({...updateddata,[e.target.name]:e.target.value})}}></input>
              </div>
              <button className="btnaddnew" onClick={updateProducts}><FontAwesomeIcon icon={faCheckCircle} /> Update</button>
           </div>

       </div>
   )
}
export default Form;
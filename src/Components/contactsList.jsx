import * as React from "react";
import { addIcon, closeIcon, contacts, deleteIcon, editIcon } from "./constants";
import './contactStyles.css'

const initialNumStore = {id:undefined,name: '', phone: '', type: 'Business', gender: 'Male'};

const reducer = (store,action)=>{
    switch (action.type) {
        case "change":
            return {...store,[action.payload.key]:action.payload.value};
        case "edit":
            return {...action.payload};
        case "reset":
            return {...initialNumStore};
        default:
            return initialNumStore;
    }
}

const ContactList = (props)=>{
    const [numStore,dispatch] = React.useReducer(reducer,initialNumStore);

    const [numbers,setNumbers] = React.useState([]);
    const [isPopupOpen,setPopup] = React.useState(false);

    const keys = numbers.length>0?Object.keys(numbers[0]):[];

    const inputChange = (e)=>{
        dispatch({type:'change',payload:{key:e.target.name,value:e.target.value}});
    }
    const selectChange = (e)=>{
        dispatch({type:'change',payload:{key:e.target.name,value:e.target.value}});
    }

    const handleEditClick = (prevContact)=>{
        const payload={type:'edit',payload:prevContact};
        dispatch({...payload});
        setPopup(true);
    }

    const closeDialog = ()=>{
        setPopup(false);
        dispatch({type:'reset',payload:{}});
    }

    const deletNumber =(delIndex)=>{
        //if we use API's I'll call DELETE API here
        const remainingNumbers = numbers.filter((num,index)=>delIndex!==index);
        setNumbers(remainingNumbers);
}

    const handleAddEditClick = ()=>{
        if (numStore.name==='' || numStore.phone===''){
            alert("Please give name/phone_number");
            return;
        }
        if (!numStore.id){
            delete numStore.id;
            setNumbers([...numbers,numStore]);
            //if we use API's I'll call POST API here
        }else{
            let newEditedNumbers = numbers.map((num,index)=>{
                if(index===numStore.id){
                    delete numStore.id
                    return numStore;
                }else{
                    return num;
                }
            })
            // delete numStore.id;
            setNumbers([...newEditedNumbers])
            //if we use API's I'll call UPDATE API here
}
        closeDialog();
    }

    const bgColor = (num)=>(num%2===1)?'bg-emerald-50':'bg-teal-100';

    const addButtonStyle =  `${isPopupOpen?'opacity-50 cursor-not-allowed':''} button-style text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex items-center`;

    const giveNumberOfKeys = (type,key)=>{
        let count = 0
        numbers.forEach((num)=>{
                if(num[type]===key){
                    count+=1;
                }
        });
        return count;
    }

    React.useEffect(()=>{
        //if we use API's I'll call getcontacts API here
        setNumbers([...contacts]);
    },[])

    return(       
            <div className="relative overflow-x-auto p-6 border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex justify-between items-center bg-slate-100 mb-4 rounded-lg p-2 border">
                            <h1 className="text-xl font-bold leading-none text-gray-900 dark:text-white mr-2">
                                Male Contacts
                            </h1>
                            <h1 className="text-green-500 font-medium mt-1">{giveNumberOfKeys('gender','Male')}</h1>
                        </div>
                        <div className="flex justify-between items-center bg-slate-100 mb-4 rounded-lg p-2 border">
                            <h1 className="text-xl font-bold leading-none text-gray-900 dark:text-white mr-2">
                                Female Contacts
                            </h1>
                            <p className="text-green-500 font-medium mt-1">{giveNumberOfKeys('gender','Female')}</p>
                        </div>
                        <div className="flex justify-between items-center bg-slate-100 mb-4 rounded-lg p-2 border">
                            <h1 className="text-xl font-bold leading-none text-gray-900 dark:text-white mr-2">
                                Business Contacts
                            </h1>
                            <p className="text-green-500 font-medium mt-1">{giveNumberOfKeys('type','Business')}</p>
                        </div>
                        <div className="flex justify-between items-center bg-slate-100 mb-4 rounded-lg p-2 border">
                            <h1 className="text-xl font-bold leading-none text-gray-900 dark:text-white mr-2">
                                Personal Contacts
                            </h1>
                            <p className="text-green-500 font-medium mt-1">{giveNumberOfKeys('type','Personal')}</p>
                        </div>
                </div>
              {
              numbers.length>0&&
              <div>
                <table className="w-full bg-emerald-100 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-emerald-400 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {keys.map((keyName,index)=><th key={String(index)+keyName} scope="col" className="px-6 py-3">
                                {keyName}
                            </th>)}
                            <th>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            numbers.map((eachNum,index)=><tr className={"dark:bg-gray-800 dark:border-gray-700 "+bgColor(index)}>
                                {keys.map((keyName,index)=><td key={String(index)} className="px-6 py-4">
                                {eachNum[keyName]}
                            </td>)}
                            <td className="flex align-center py-4">
                            <span title="Click to Edit" onClick={()=>handleEditClick({...eachNum,id:index})} className="mr-4 cursor-pointer">{editIcon}</span>
                            <span title="Click to Delete the Contact" onClick={()=>deletNumber(index)} className="cursor-pointer">{deleteIcon}</span>
                            </td>
                            </tr>)
                        }
                    </tbody>
                </table>
                </div>}
                
                <button draggable='true' type="button" disabled={isPopupOpen} onClick={()=>setPopup(true)} className={addButtonStyle}>
                    <span className="pr-2">{addIcon}</span>Add Contact</button>
                {
                    isPopupOpen &&
                    <div className="popup">
                       <div className="popup-innter-container p-4 border-solid border-2 border-black rounded-2xl bg-green-200">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="chat-notification-title">{!numStore.id?'Add ':'Edit '} Contact</h1>
                            <p onClick={()=>closeDialog()} >{closeIcon }</p>
                        </div>
                        <select  name="type" onChange={selectChange} defaultValue={numStore.type} placeholder='Select Contact type' className="block appearance-none bg-green-300  w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="Business">Business</option>
                            <option value="Personal">Personal</option>
                        </select>
                        <input
                        onChange={inputChange} 
                        value={numStore.name} 
                        type="text" 
                        name="name"
                        className="mt-2 bg-green-300 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" 
                        placeholder="Enter Name"/>
                        <input 
                        onChange={inputChange} 
                        value={numStore.phone} 
                        type="text" 
                        name="phone"
                        className="mt-2 bg-green-300 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500" 
                        placeholder="Enter Number"/>
                        <select name="gender" onChange={selectChange} defaultValue={numStore.gender} placeholder='Select Gender' className="mt-2 block appearance-none bg-green-300  w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <div className="flex justify-between pt-2">
                            <button onClick={()=>closeDialog()} className="bg-green-300 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-lg">cancel</button>
                            <button onClick={()=>handleAddEditClick()} className="bg-green-300 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded-lg">add</button>
                        </div>
                   </div> 
                    </div>
                   
                }
            </div>
    )
}

export default ContactList;
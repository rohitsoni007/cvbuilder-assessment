import React from "react";
import { toast } from "react-toastify";
// import Swal from 'sweetalert2';
// import "sweetalert2/dist/sweetalert2.css";

// toast.configure();

function capitalizeFirstLetter(string) {
    if(string!==null && string!==''){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }else{
        return ''
    }
  }
  

const showNotification = (type, message) => {
    switch (type) {
        case "success":
            
            // Swal.fire({
            //     position: 'center',
            //     // icon: 'success',
            //     text: capitalizeFirstLetter(message.toString()),
            //     showConfirmButton: false,
            //     timer: 1500
            // })
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT, autoClose: 2000
            });
            break;
        case "error":
            // Swal.fire({
            //     // icon: 'error',
            //     // title: message,
            //     showConfirmButton: false,
            //     text: capitalizeFirstLetter(message.toString()),
            //     timer: 1500

            // })
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT, autoClose: 2000
            });
            break;
        case "default":
            toast(message, {
                position: toast.POSITION.TOP_RIGHT,autoClose: 2000
            });
            break;
        default:
            break;
    }
};

export default showNotification;

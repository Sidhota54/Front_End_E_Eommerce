import React, { useRef, useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { AiFillPrinter } from "react-icons/ai";
import {useReactToPrint} from "react-to-print";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const orderDetailsRef = useRef();
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  const printDetails = () =>{
    useReactToPrint({
      content: () => orderDetailsRef.current,
    })
  } 

  return (
    <DialogContent className="h-[90vh] overflow-y-scroll p-2">
      <div>
      <AiFillPrinter
              className="hover:text-slate-500  cursor-pointer"
              onClick={printDetails}
              size={32}
            />
        
        <OrderDetailsComponent orderDetails={orderDetails} user={user} ref={orderDetailsRef} />

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            inputValue={orderDetails?.orderStatus}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
      
    </DialogContent>
  );
}

const OrderDetailsComponent = React.forwardRef((props,ref) => {
  let orderDetails = props.orderDetails
  let user = props.user
  return(
    <div ref={ref} className="grid gap-4 text-sm p-4 ">
    <div className="grid gap-0">
      <div className="flex mt-0 items-center justify-between">
        <p className="font-medium">Order ID</p>
        <Label>{orderDetails?._id}</Label>
      </div>
      <div className="flex mt-2 items-center justify-between">
        <p className="font-medium">Order Date</p>
        <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
      </div>
      <div className="flex mt-2 items-center justify-between">
        <p className="font-medium">Order Price</p>
        <Label>${orderDetails?.totalAmount}</Label>
      </div>
      <div className="flex mt-2 items-center justify-between">
        <p className="font-medium">Payment method</p>
        <Label>{orderDetails?.paymentMethod}</Label>
      </div>
      <div className="flex mt-2 items-center justify-between">
        <p className="font-medium">Payment Status</p>
        <Label>{orderDetails?.paymentStatus}</Label>
      </div>
      <div className="flex mt-2 items-center justify-between">
        <p className="font-medium">Order Status</p>
        <Label>
          <Badge
            className={`py-1 px-2 ${
              orderDetails?.orderStatus === "pending"
                ? "bg-[#FFA500]" // Orange
                : orderDetails?.orderStatus === "inProcess"
                ? "bg-[#007BFF]" // Blue
                : orderDetails?.orderStatus === "inShipping"
                ? "bg-[#17A2B8]" // Teal
                : orderDetails?.orderStatus === "delivered"
                ? "bg-[#28A745]" // Green
                : orderDetails?.orderStatus === "rejected"
                ? "bg-[#DC3545]" // Red
                : "bg-black" // Default fallback
            }`}
          >
            {orderDetails?.orderStatus.toUpperCase()}
          </Badge>
        </Label>
      </div>
    </div>
    <Separator />
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="font-medium">Order Details</div>
        <ul className="grid gap-3">
          {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
            ? orderDetails?.cartItems.map((item) => (
                <li className="flex items-center justify-between">
                  <span>Title: {item.title}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: ${item.price}</span>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
    <div className="grid gap-2">
      <div className="font-medium">Shipping Info</div>
      <div className=" text-gray-500">
        <h4 class>{user.userName}</h4>
        <div>
          <span>{orderDetails?.addressInfo?.address},</span>
          <span>{orderDetails?.addressInfo?.city},</span>
          <span>{orderDetails?.addressInfo?.pincode},</span>
          <span>{orderDetails?.addressInfo?.phone},</span>
          <span>{orderDetails?.addressInfo?.notes},</span>
        </div>
      </div>
    </div>
  </div>
  )
})

export default AdminOrderDetailsView;

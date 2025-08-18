// const parcelUpdateValidation = async (parcelId:string, payload)=>{
//       const parcel = await Parcel.findById(parcelId);
    
//       if (!parcel) {
//         throw new AppError(404, "No parcel found to update status.");
//       }
    
//       if (!parcel.receiver.equals(payload.updatedBy)) {
//         throw new AppError(
//           httStatus.UNAUTHORIZED,
//           "You are not owner of this parcel."
//         );
//       }
    
//       if (parcel.isBlock) {
//         throw new AppError(
//           httStatus.BAD_REQUEST,
//           "This parcel is blocked, you can't update it's status."
//         );
//       }
    
//       if(parcel.currentStatus !== ParcelStatus.REQUESTED && 
//          parcel.currentStatus !== ParcelStatus.APPROVED ){
//             throw new AppError(
//           httStatus.BAD_REQUEST,
//           "You can cancel a parcel only before DISPATCHED."
//         );
//       }
    
//       if(payload.status !== ParcelStatus.CANCELLED){
//             throw new AppError(
//           httStatus.BAD_REQUEST,
//           "You can only cancel your parcel from here"
//         );
//       }
// }
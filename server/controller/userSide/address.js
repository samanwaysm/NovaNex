var addressDb = require('../../model/addressSchema');


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.addAddress = async (req, res) => {
  const returnTo = req.session.returnTo;
  try {
    // function capitalizeFirstLetter(string) {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }

    req.body.fullName = capitalizeFirstLetter(req.body.fName);
    req.body.locality = capitalizeFirstLetter(req.body.locality);
    req.body.district = capitalizeFirstLetter(req.body.district);
    req.body.state = capitalizeFirstLetter(req.body.state);

    const isAddress = await addressDb.findOne({
      userId: req.session.userId,
      "address.fName": req.body.fName,
      "address.pincode": req.body.pincode,
      "address.locality": req.body.locality,
      "address.address": req.body.address,
      "address.district": req.body.district,
      "address.state": req.body.state,
    });

    if (isAddress) {
      req.session.exist = "This address already exist";
      return res.status(401).redirect("/addAddress");
    }

    const structuredAddress = `${req.body.fName}, ${req.body.address}, ${req.body.locality}, ${req.body.district}, ${req.body.state} - ${req.body.pincode}`;
    // ${req.body.fName}, ${req.body.address}, ${req.body.locality}, ${req.body.district}, ${req.body.state} - ${req.body.pincode};

    await addressDb.updateOne(
      { userId: req.session.userId },
      {
        $push: {
          address: {
            fullName: req.body.fName,
            pincode: req.body.pincode,
            locality: req.body.locality,
            address: req.body.address,
            district: req.body.district,
            state: req.body.state,
            structuredAddress,
          },
        },
      },
      { upsert: true }
    );

    const addres = await addressDb.findOne({
      userId: req.session.userId,
    });

    if (!addres.defaultAddress || addres.address.length === 1) {
      await addressDb.updateOne(
        { userId: req.session.userId },
        { $set: { defaultAddress: addres.address[0]._id } }
      );
    }
    if (returnTo === 'checkout') {
      delete req.session.returnTo
      console.log('Redirecting to userCheckout');
      res.status(200).redirect('/checkout');
    } else {
      console.log('Redirecting to userAddress');
      res.redirect('/userAddressPage');
    }
    // res.status(200).redirect("/userAddressPage");
  } catch (err) {
    console.log(err);
  }
}


exports.showAddress = async (req,res,next) => {
  const userId = req.query.userId;
  const addressId=req.query.addressId;
  try{
    if(!addressId){
      const address=await addressDb.findOne({"userId":userId}).populate('defaultAddress');
      res.send(address);
    }
    else{
      const address=await addressDb.findOne({"userId":userId })
      const oneAdd = address.address.find(element => {
        return String(element._id) === addressId
      })
      console.log(oneAdd);
      res.send(oneAdd);
    }

  }catch(err){
    // console.log(err);
    // res.status(500).send("internal server error");
    next(err)
  }
}

exports.showEditAddress = async (req, res) => {
  const userId = req.query.userId;
  const addressId = req.query.addressId;
  try {
      const user = await addressDb.findOne({ _id: userId });
      if (user) {
          const address = user.address.find(address => address._id.toString() === addressId);
          if (address) {
              res.send(address)
          } else {
              res.status(404).send("Address not found");
          }
      } else {
          res.status(404).send("User not found");
      }
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
};


exports.editAddress = async (req, res) => {
  const returnTo = req.session.returnTo;
  try {
    const addressId = req.query.id;

    // Validate if the addressId is provided
    if (!addressId) {
      return res.status(400).send("Address ID is required");
    }

    // Check if the address exists
    const existingAddress = await addressDb.findOne({
      userId: req.session.userId,
      "address._id": addressId,
    });

    if (!existingAddress) {
      return res.status(404).send("Address not found");
    }

    fullName = capitalizeFirstLetter(req.body.fName);
    locality = capitalizeFirstLetter(req.body.locality);
    district = capitalizeFirstLetter(req.body.district);
    state = capitalizeFirstLetter(req.body.state);

    // Update the existing address
    await addressDb.updateOne(
      {
        userId: req.session.userId,
        "address._id": addressId,
      },
      {
        $set: {
          "address.$.fullName": fullName,
          "address.$.pincode": req.body.pincode,
          "address.$.locality": locality,
          "address.$.address": req.body.address,
          "address.$.district": district,
          "address.$.state": state,
          "address.$.structuredAddress": `${fullName}, ${req.body.address}, ${locality}, ${district}, ${state} - ${req.body.pincode}`,
        },
      }
    );
    if (returnTo === 'checkout') {
      delete req.session.returnTo
      console.log('Redirecting to userCheckout');
      res.status(200).redirect('/checkout');
    } else {
      console.log('Redirecting to userAddress');
      res.redirect('/userAddressPage');
    }
    // res.status(200).redirect("/userAddressPage");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// set default
exports.changeToDefault=async(req,res)=>{
  const returnTo = req.query.returnTo;
  req.session.returnTo = returnTo;
  const addressId = req.query.id
  console.log(addressId);
  try {
    await addressDb.updateOne(
      { userId: req.session.userId },
      { $set: { defaultAddress: addressId } }
    );
    if (returnTo === 'checkout') {
      delete req.session.returnTo
      console.log('Redirecting to userCheckout');
      res.status(200).redirect('/checkout');
    } else {
      console.log('Redirecting to userAddress');
      res.redirect('/userAddressPage');
    }
    // res.status(200).redirect("/userAddressPage");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}

exports.deleteAddress = async (req, res) => {
  try {
    const returnTo = req.query.returnTo;
    req.session.returnTo = returnTo;
    const userId = req.session.userId;
    const addressIdToDelete = req.query.addressId;
    await addressDb.updateOne(
      { userId: userId },
      { $pull: { address: { _id: addressIdToDelete } } }
    );
    const updatedUser = await addressDb.findOne({ userId: userId });
    if (updatedUser && updatedUser.address.length > 0 && !updatedUser.defaultAddress) {
      await addressDb.updateOne(
        { userId: userId },
        { $set: { defaultAddress: updatedUser.address[0]._id } }
      );
    }

    if (returnTo === 'checkout') {
      delete req.session.returnTo
      console.log('Redirecting to userCheckout');
      res.status(200).redirect('/checkout');
    } else {
      console.log('Redirecting to userAddress');
      res.redirect('/userAddressPage');
    }
    // res.status(200).redirect("/userAddressPage");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

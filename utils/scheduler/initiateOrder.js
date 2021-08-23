const axios = require("axios").default;

const { Order } = require("../../models/order");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const { sendEmailForCompletedAnalysis  } = require("../emails/mailingService");

exports.initiateOrder = async () => {
    let orders, analysed, login;

    try {
        orders = await Order.find({ completed: false }).sort({ date: "asc" }).exec();
    } catch(error) {
        console.log(error);
        return { status: StatusCodes.INTERNAL_SERVER_ERROR }
    }

    if(!orders || orders.length < 1) return { status: StatusCodes.NOT_FOUND }

    const oldestOrder = orders[0];

    try {
        analysed = await axios.post(`${process.env.API_URL}/api/initiate/${oldestOrder._id}`, {}, {
            headers: {
                Authorization: `Bearer ${process.env.JWT_TOKEN}`
            }
        });
    } catch(error) {
        if(!error.response) return { status: StatusCodes.INTERNAL_SERVER_ERROR }

        if(error.response.status === 401) {
            try {
                login = await axios.post(`${process.env.API_URL}/api/login`, {
                    email: process.env.PYEMAIL,
                    password: process.env.PYPASSWORD
                });
            } catch(error) {
                console.log(error);
                return { status: StatusCodes.INTERNAL_SERVER_ERROR }
            }
    
            if(login.status === 200) {
                process.env.JWT_TOKEN = login.data.token;
    
                try {
                    analysed = await axios.post(`${process.env.API_URL}/api/initiate/${oldestOrder._id}`, {}, {
                        headers: {
                            Authorization: `Bearer ${login.data.token}`
                        }
                    });
                } catch(error) {
                    console.log(error);
                    return { status: StatusCodes.INTERNAL_SERVER_ERROR }
                }
            } else {
                return { status: StatusCodes.INTERNAL_SERVER_ERROR }
            }
        } else {
            return { status: StatusCodes.INTERNAL_SERVER_ERROR }
        }
    }

    if(analysed.status !== 200) return { status: StatusCodes.INTERNAL_SERVER_ERROR }

    sendEmailForCompletedAnalysis(analysed.data, oldestOrder.email);
}
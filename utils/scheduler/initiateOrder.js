const axios = require("axios").default;

const { Request } = require("../../models/request");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.initiateOrder = async () => {
    let orders, analysed;

    try {
        orders = await Request.find({ completed: false }).sort({ date: "asc" }).exec();
    } catch(error) {
        console.log(error);
        return { status: StatusCodes.INTERNAL_SERVER_ERROR }
    }

    if(!orders || orders.length < 1) return { status: StatusCodes.NOT_FOUND }

    const oldestOrder = orders[0];

    try {
        analysed = await axios.post(`http://localhost:5000/initiate/${oldestOrder._id}`);
    } catch(error) {
        console.log(error);
        return { status: StatusCodes.INTERNAL_SERVER_ERROR }
    }

    if(analysed.status !== 200) return { status: StatusCodes.INTERNAL_SERVER_ERROR }

    console.log(analysed.data.ucParam)

    const ucParam = analysed.data.ucParam;

    if(!!ucParam) {
        const emailMessage = `Dear user, <br /><br />ReqUML has completed the analysis of your user stories. Follow the URL below to preview and download your use case diagrams. <br /><br /><a href="http://localhost:3050/uc/${ucParam}"><b>http://localhost:3050/uc/${ucParam}</b></a><br /><br />Should you have any questions, do not hesitate to contact us at <b>contact@requml.co.uk</b><br /><br />Best wishes,<br />ReqUML Team`;

        const msg = {
            to: oldestOrder.email,
            from: { 
                "email": "noreply@requml.co.uk",
                "name": "ReqUML"
            },
            subject: `ReqUML - Your analysis has been completed`,
            html: emailMessage
        }

        sgMail
            .send(msg)
            .then(async () => {
                console.log("Email sent");
            })
            .catch(error => {
                console.log(error.body.errors);
            });
    }

}
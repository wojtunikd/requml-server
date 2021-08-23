const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.sendEmailForCompletedAnalysis = (data, email) => {
    
    if(!!data.ucParam && !!data.classParam) {
        const emailMessage = `Dear user, <br /><br />ReqUML has completed the analysis of your user stories. Follow the URL below to preview and download your use case diagrams. <br /><br /><a href="https://ready.requml.co.uk/uc/${data.ucParam}"><b>https://ready.requml.co.uk/uc/${data.ucParam}</b></a><br /><br /><a href="https://ready.requml.co.uk/class/${data.classParam}"><b>https://ready.requml.co.uk/class/${data.classParam}</b></a><br /><br />Should you have any questions, do not hesitate to contact us at <b>contact@requml.co.uk</b><br /><br />Best wishes,<br />ReqUML Team`;

        const msg = {
            to: email,
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
    } else {
        console.log("Some parameters missing!")
    }
}
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const roleArn = config.require("roleArn");


const responseMessage = config.get("responseMessage") || ""

const lambda = new aws.lambda.Function("test-lambda", {
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive("./app"),
     }),
     runtime: aws.lambda.Runtime.NodeJS24dX,
     role: roleArn,
     handler: "index.handler",
     environment: {
        variables: {
            "RESPONSE_MESSAGE": responseMessage
        }
     }
});

const lambdaPermission = new aws.lambda.Permission("lambdapermission", {
    action: "lambda:InvokeFunction",
    principal: "apigateway.amazonaws.com",
    function: lambda
});


const apigw = new aws.apigatewayv2.Api("http-api", {
    protocolType: "HTTP",
    routeKey: "GET /",
    target: lambda.invokeArn
});

export const endpoint = apigw.apiEndpoint;
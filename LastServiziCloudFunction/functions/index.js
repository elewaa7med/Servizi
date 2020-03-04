const functions = require('firebase-functions');
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// Send Welcome Notification To Customer
exports.welcomeNotificationCustomer = functions.database.ref('Users/{userId}')
    .onCreate((snapshot, context) => {
        const token = snapshot.child("messageToken").val(),
            titleValue = "Justcall-UAE",
            bodyValue = "عميلنا العزيز شكرا لتسجيلكم معنا يمكنك الآن ارسال طلب الصيانة من خلال التطبيق وسيقوم موظفونا بالتواصل معكم على الفور نعمل على مدار الساعة هدفنا خدمتكم وراحتكم. شركة جست كول للمقاولات والصيانة العامة \n " +
                "Dear Valued customer, Thank you for registering with us , you can submit your request through the Justcall-UAE App and our customer service will contact you immediately. We work 24/7 our goal to serve you. JustCall Contracting & General Maintenance";
        // var badgeCount = element.child("badge").val(),
        // badgeNumber = parseInt(badgeCount) + 1;
        // console.log(badgeNumber);

        if (token !== null) {
            var payload = {
                notification: {
                    title: titleValue,
                    body: bodyValue,
                    sound: "default",
                    // badge: badgeNumber + ""
                },
                data: {
                    // type: snapshot.val().requestId,
                    // activity_key: "FREELANCER_POST_DETAILS"
                }
            };
            admin.messaging().sendToDevice(token, payload)
                .then((response) => {
                    return console.log("Successfully sending message:", response);
                }).catch((error) => {
                    return console.log("Error sending message:", error);
                });
        }
        return;
    });

// Send Welcome Notification To Freelancer
exports.welcomeNotificationWorker = functions.database.ref('Workers/{workerId}')
    .onCreate((snapshot, context) => {
        const token = snapshot.child("messageToken").val(),
            titleValue = "Justcall-UAE";
        var bodyValue = ["شريكنا العزيز، نشكر لك ثقتك بشركة جست كول للمقاولات والصيانة العامة ، لقد قمت بالتسجيل معنا كشريك عمل وستقوم باستقبال طلبات الخدمات من خلال التطبيق حسب المنطقة التي تقطنها راجين عدم الخروج التام من التطبيق حتى تتلقى الاشعارات. \n " +
            " Dear Partner, thank you for registering with Justcall Cont& General maintenance as  a freelancer profession, you will start receiving requests from our customers very soon. Please keep Seayanah-UAE App in the background DON’T logout in order to receive notifications",
        "في حال استلامكم لأي طلب من عملائنا يرجى ادخال تكلفة العمل الذي ستقوم به وسيقوم العميل بالموافقة على العرض المناسب له حسيث سنقوم بارسال جميع العروض التي يقدمها زملاؤك للعميل وفي حال الموافقة على عرض السعر الخاص بك من قبل العميل سيتم اشعارك بذلك. \n " +
        " Once you receive a request from the customer, please enter your price offer and the customer will accept or reject your offer as other professions will send their own price offer. If the customer accepted your offer you will receive a notification to start work.",
        "يرجى العلم بأن نسبة شركة جست كول للمقاولات والصيانة العامة من الفاتورة الاجمالية للعمل هي 20% من مجمل الفاتورة النهائية وفي حال زادت التكلفة عن التكلفة المذكورة في عرضكم يرجى اعلامنا كونه يتم التدقيق مع العميل عند انتهاء العمل. ويتم تحويل نسبة الشركة من قبلكم لحسابنا البنكي او حوالة مصرفية وبشكل اسبوعي حتى تتمكن من الاستمرار بالعمل معنا شاكرين لكم حسن تعاونكم. \n " +
        " Please note that our commission will be 20% of the total amount of your offer and in case the price was raised up during work you have to mention that as our system will confirm the last total cost. You will be requested to transfer to our bank account the mentioned amount in weekly basis to continue working with us."
        ];
        // var badgeCount = element.child("badge").val(),
        // badgeNumber = parseInt(badgeCount) + 1;
        // console.log(badgeNumber);
        if (token !== null) {
            for (var counter = 0; counter < 3; counter++) {
                var payload = {
                    notification: {
                        title: titleValue,
                        body: bodyValue[counter],
                        sound: "default",
                        // badge: badgeNumber + ""
                    },
                    data: {
                        // type: snapshot.val().requestId,
                        // activity_key: "FREELANCER_POST_DETAILS"
                    }
                };
                admin.messaging().sendToDevice(token, payload)
                    .then((response) => {
                        return console.log("Successfully sending message:", response);
                    })
                    .catch((error) => {
                        return console.log("Error sending message:", error);
                    });
            }
        }
        return;
    });

// send notification Depend on Request/any id / state
exports.sendNotification = functions.database.ref('Requests/{ReqestId}/state')
    .onUpdate((change, context) => {
        const state = change.after.val();
        // when state change to post
        if (state === "POST") {
            admin.database().ref(change.after.ref.parent.path).once('value').then(snap => {
                const customerId = snap.child("customerId").val();
                const categoryId = snap.child("categoryId").val();
                const location = snap.child("location").val();
                const cityId = location.city;
                var SendingDevices = [],
                    counter = 0;
                // send notification to Customer when his request is posting to Freelancer
                admin.database().ref("Users/" + customerId).once('value').then(element => {
                    const token = element.child("messageToken").val(),
                        titleValue = "Justcall-UAE",
                        bodyValue = "Your Service Request Now Is Posted To FreeLnceers You will Recive Notification When They making Offers \n"+
                        "تم إرسال طلب الخدمة الخاص بك الآن إلى المستقلين ، وسوف تستلم إشعارًا عند تقديم العروض";
                    // var badgeCount = element.child("badge").val(),
                    // badgeNumber = parseInt(badgeCount) + 1;
                    // console.log(badgeNumber);

                    // Upload the new value of badge into Firebase to keep track of the number
                    var payload = {
                        "notification": {
                            "title": titleValue,
                            "body": bodyValue,
                            "sound": "default",
                            // badge: badgeNumber + ""
                        },
                        "data": {
                            "type": snap.child("orderId").val(),
                            "activity_key": "CUSTOMER_POST_DETAILS"
                        }
                    };
                    admin.messaging().sendToDevice(token, payload)
                        .then((response) => {
                            var value = "NotificationCustomer/" + customerId;
                            admin.database().ref(value).push().set({
                                title: titleValue,
                                message: bodyValue,
                                shown: false,
                                orderId: snap.child("orderId").val()
                            });
                            // admin.database().ref("Users/" + customerId).update({ badge: badgeNumber });
                            return console.log("Successfully sending message:", response);
                        })
                        .catch((error) => {
                            return console.log("Error sending message:", error);
                        });
                    return;
                }).catch(error => { });
                // send notification to all worker within the (category & city ) of customer's service request
                admin.database().ref("Workers").once('value').then(element => {
                    var titleValue = "Justcall-UAE",
                        bodyValue = "You Have New Request ,You can Make offer \n"+ "لديك طلب جديد ، يمكنك تقديم عرض الآن";
                    element.forEach((childOfElement) => {
                        var workerValue = childOfElement.val(),
                            workerCategory;
                        workerCategory = workerValue.workerCategoryid;
                        if (workerCategory.localeCompare(categoryId) === 0) {
                            var token = workerValue.messageToken;
                            // badgeCount = workerValue.badge,
                            // badgeNumber = parseInt(badgeCount) + 1,
                            var value = "NotificationFreelancer/" + workerValue.workerId;
                            admin.database().ref(value).push().set({
                                title: titleValue,
                                message: bodyValue,
                                shown: false,
                                orderId: snap.child("orderId").val()
                            });
                            if (token !== undefined) {
                                SendingDevices[counter] = token;
                                counter++;
                            }
                        }
                    });
                    if (SendingDevices !== []) {
                        var payload = {
                            notification: {
                                title: titleValue,
                                body: bodyValue,
                                sound: "default",
                                // badge: badgeNumber + ""
                            },
                            data: {
                                type: snap.child("orderId").val(),
                                activity_key: "FREELANCER_POST_DETAILS"
                            }
                        };
                        admin.messaging().sendToDevice(SendingDevices, payload)
                            .then((response) => {
                                return console.log("Successfully sending message:", response);
                            }).catch((error) => {
                                return console.log("Error sending message:", error);
                            });
                    }
                    return;
                }).catch(error => { console.log("adming worker" + error); });

                return;
            }).catch(error => { console.log(error); });
            return;
        }

        // Freelancer close job send notification to customer notify him job is finished
        else if (state === "FREELANCE_FINISHED") {
            admin.database().ref(change.after.ref.parent.path).once('value').then(snap => {
                const customerId = snap.child("customerId").val(),
                    titleValue = "Justcall-UAE",
                    bodyValue = "Freelancer finish Job , Job Has Been Finished Successfully. \n"+".العامل المستقل انهى العمل ، تم الانتهاء من الوظيفة بنجاح.";
                admin.database().ref("Users/" + customerId).once('value').then(element => {
                    const token = element.child("messageToken").val();
                    console.log(token);
                    // var badgeCount = element.child("badge").val(),
                    // badgeNumber = parseInt(badgeCount) + 1;
                    if (token !== null) {
                        var payload = {
                            notification: {
                                title: titleValue,
                                body: bodyValue,
                                sound: "default",
                                icon: "default",
                                // badge: badgeNumber + ""
                            },
                            data: {
                                type: snap.child("orderId").val(),
                                activity_key: "CUSTOMER_POST_DETAILS"
                            }
                        };
                        admin.messaging().sendToDevice(token, payload)
                            .then((response) => {
                                var value = "NotificationCustomer/" + customerId;
                                admin.database().ref(value).push().set({
                                    title: titleValue,
                                    message: bodyValue,
                                    shown: false,
                                    orderId: snap.child("orderId").val()
                                });
                                // admin.database().ref("CPNotification").push().set({
                                //     customerId: customerId,
                                //     freelancerId: snap.val().freelancerId,
                                //     keyword: "FREELANCE_FINISHED",
                                //     state: true,
                                //     time: new Date(),
                                //     orderId: snap.child("orderId").val()
                                // });
                                // admin.database().ref("Users/" + customerId).update({ badge: badgeNumber });
                                return console.log("suceessfully sending message:", response);
                            })
                            .catch((error) => {
                                return console.log("Error sending message:", error);
                            });
                    } else {
                        var value = "NotificationCustomer/" + customerId;
                        admin.database().ref(value).push().set({
                            title: titleValue,
                            message: bodyValue,
                            shown: false,
                            orderId: snap.child("orderId").val()
                        });
                        // admin.database().ref("CPNotification").push().set({
                        //     customerId: customerId,
                        //     freelancerId: snap.val().freelancerId,
                        //     keyword: "FREELANCE_FINISHED",
                        //     state: true,
                        //     time: new Date(),
                        //     orderId: snap.child("orderId").val()
                        // });
                    }
                    return;
                }).catch(error => { });
                return;
            }).catch(error => { });
        }
        else if (state === "CM_FINISHED") {
            admin.database().ref(change.after.ref.parent.path).once('value').then(snap => {
                const customerId = snap.child("customerId").val(),
                    costValue = snap.child("cost").val(),
                    titleValue = "Justcall-UAE",
                    bodyValue = "عميلنا العزيز لقد تم انجاز العمل المطلوب بتكلفة ( "+ costValue +"درهم) متمنين أن نكون دائما عند حسن ظنكم بنا. لإبداء أية ملاحظات يرجى التواصل من خلال الواتس أب على الرقم 0554598039 \n" +
                        "Dear valued customer, Work has been accomplished successfully with cost of ("+costValue+" AED). \nThank you for business with us. \nFor any feedback kindly send on our WhatsApp no (0554598039).";
                admin.database().ref("Users/" + customerId).once('value').then(element => {
                    const token = element.child("messageToken").val();
                    // var badgeCount = element.child("badge").val(),
                    // badgeNumber = parseInt(badgeCount) + 1;
                    if (token !== null) {
                        var payload = {
                            notification: {
                                title: titleValue,
                                body: bodyValue,
                                sound: "default",
                                // badge: badgeNumber + ""
                            },
                            data: {
                                type: snap.child("orderId").val(),
                                activity_key: "CUSTOMER_POST_DETAILS"
                            }
                        };

                        admin.messaging().sendToDevice(token, payload)
                            .then((response) => {

                                var value = "NotificationCustomer/" + customerId;
                                admin.database().ref(value).push().set({
                                    title: titleValue,
                                    message: bodyValue,
                                    shown: false,
                                    orderId: snap.child("orderId").val()
                                });
                                // admin.database().ref("Users/" + customerId).update({ badge: badgeNumber });
                                return console.log("suceessfully sending message:", response);

                            })
                            .catch((error) => {
                                return console.log("Error sending message:", error);
                            });
                    } else {
                        var value = "NotificationCustomer/" + customerId;
                        admin.database().ref(value).push().set({
                            title: titleValue,
                            message: bodyValue,
                            shown: false,
                            orderId: snap.child("orderId").val()
                        });
                    }
                    return;
                }).catch(error => { });
                return;
            }).catch(error => { });
        }
        else if (state === "CANCEL") {
            admin.database().ref(change.after.ref.parent.path).once('value').then(snap => {
                const customerId = snap.child("customerId").val(),
                    titleValue = "Justcall-UAE",
                    bodyValue = " Your Request has been canceled \n" + "تم إلغاء طلبك";
                admin.database().ref("Users/" + customerId).once('value').then(element => {
                    const token = element.child("messageToken").val();
                    // var badgeCount = element.child("badge").val(),
                    // badgeNumber = parseInt(badgeCount) + 1;
                    if (token !== null) {
                        var payload = {
                            notification: {
                                title: titleValue,
                                body: bodyValue,
                                sound: "default",
                                // badge: badgeNumber + ""
                            },
                            data: {
                                type: snap.child("orderId").val(),
                                activity_key: "CUSTOMER_POST_DETAILS"
                            }
                        };

                        admin.messaging().sendToDevice(token, payload)
                            .then((response) => {

                                var value = "NotificationCustomer/" + customerId;
                                admin.database().ref(value).push().set({
                                    title: titleValue,
                                    message: bodyValue,
                                    shown: false,
                                    orderId: snap.child("orderId").val()
                                });
                                // admin.database().ref("Users/" + customerId).update({ badge: badgeNumber });
                                return console.log("suceessfully sending message:", response);

                            })
                            .catch((error) => {
                                return console.log("Error sending message:", error);
                            });
                    } else {
                        var value = "NotificationCustomer/" + customerId;
                        admin.database().ref(value).push().set({
                            title: titleValue,
                            message: bodyValue,
                            shown: false,
                            orderId: snap.child("orderId").val()
                        });
                    }
                    return;
                }).catch(error => { });
                return;
            }).catch(error => { });
        }
        return;
    });

//Freelancer make offer to post of customer notify customer (with notification)
exports.sendNotificationToSpecificFreelancer = functions.database.ref('Comments/{requestId}/{commentId}')
    .onCreate((snapshot, context) => {
        console.log(snapshot.val());
        admin.database().ref("Requests/" + snapshot.ref.parent.path.pieces_[1]).once('value').then(snap => {
            const customerId = snap.child("customerId").val(),
                titleValue = "Justcall-UAE",
                bodyValue = "Freelnacer Add New offer to your Request it's number " + snapshot.ref.parent.path.pieces_[1] + 
                "\n إضافة عرض جديد لطلبك ، رقم" + snapshot.ref.parent.path.pieces_[1];
            admin.database().ref("Users/" + customerId).once('value').then(element => {
                const token = element.child("messageToken").val();
                // var badgeCount = element.child("badge").val(),
                //     badgeNumber = parseInt(badgeCount) + 1;
                if (token !== null) {
                    var payload = {
                        notification: {
                            title: titleValue,
                            body: bodyValue,
                            sound: "default",
                            // badge: badgeNumber + ""
                        },
                        data: {
                            type: snap.child("orderId").val(),
                            activity_key: "CUSTOMER_POST_DETAILS"
                        }
                    };
                    admin.messaging().sendToDevice(token, payload)
                        .then((response) => {

                            var value = "NotificationCustomer/" + customerId;
                            admin.database().ref(value).push().set({
                                title: titleValue,
                                message: bodyValue,
                                shown: false,
                                orderId: snap.child("orderId").val()
                            });
                            // admin.database().ref("Users/" + customerId).update({ badge: badgeNumber });

                            admin.database().ref("CPNotification").push().set({
                                customerId: customerId,
                                freelancerId: snapshot.val().freelancerId,
                                Comment: snapshot.val().comment,
                                keyword: "Offer",
                                state: true,
                                time: new Date(),
                                orderId: snap.child("orderId").val()
                            });
                            return console.log("suceessfully sending message:", response);
                        })
                        .catch((error) => {
                            return console.log("Error sending message:", error);
                        });
                } else {
                    var value = "NotificationCustomer/" + customerId;
                    admin.database().ref(value).push().set({
                        title: titleValue,
                        message: bodyValue,
                        shown: false,
                        orderId: snap.child("orderId").val()
                    });
                    // admin.database().ref("Users/" + customerId).update({ badge: badgeNumber });
                    admin.database().ref("CPNotification").push().set({
                        customerId: customerId,
                        freelancerId: snapshot.val().freelancerId,
                        Comment: snapshot.val().comment,
                        keyword: "Offer",
                        state: true,
                        time: new Date(),
                        orderId: snap.child("orderId").val()
                    });
                }
                return;
            }).catch(error => { console.log(error) });

            return;
        }).catch(error => { console.log(error) });
        return;
    });

//Customer accept offer notify freelancer your offer accepted
exports.sendNotificationCustomerConnection = functions.database.ref('FreeCustomerConnection/{connectionId}')
    .onCreate((snapshot, context) => {
        admin.database().ref("Workers/" + snapshot.val().freelancerId).once('value').then(element => {
            const token = element.child("messageToken").val(),
                titleValue = "Justcall-UAE",
                bodyValue = "Customer Accepte Your Offer On Request " + snapshot.val().requestId + 
                "\n لقد قبل العميل على عرضك على الطلب " + snapshot.val().requestId;
            // var badgeCount = element.child("badge").val(),
            // badgeNumber = parseInt(badgeCount) + 1;
            // console.log(badgeNumber);
            if (token !== null) {
                var payload = {
                    notification: {
                        title: titleValue,
                        body: bodyValue,
                        sound: "default",
                        // badge: badgeNumber + ""
                    },
                    data: {
                        type: snapshot.val().requestId,
                        activity_key: "FREELANCER_POST_DETAILS"
                    }
                };
                admin.messaging().sendToDevice(token, payload)
                    .then((response) => {
                        var value = "NotificationFreelancer/" + snapshot.val().freelancerId;
                        admin.database().ref(value).push().set({
                            title: titleValue,
                            message: bodyValue,
                            shown: false,
                            orderId: snapshot.val().requestId
                        });
                        admin.database().ref("CPNotification").push().set({
                            freelancerId: snapshot.val().freelancerId,
                            customerId: snapshot.val().customerId,
                            keyword: "Accept",
                            state: true,
                            time: new Date(),
                            orderId: snapshot.val().requestId
                        });
                        // admin.database().ref("Workers/" + snapshot.val().freelancerId).update({ badge: badgeNumber });
                        return console.log("Successfully sending message:", response);
                    })
                    .catch((error) => {
                        return console.log("Error sending message:", error);
                    });
            } else {
                var value = "NotificationFreelancer/" + snapshot.val().freelancerId;
                admin.database().ref(value).push().set({
                    title: titleValue,
                    message: bodyValue,
                    shown: false,
                    orderId: snapshot.val().requestId
                });
                admin.database().ref("CPNotification").push().set({
                    freelancerId: snapshot.val().freelancerId,
                    customerId: snapshot.val().customerId,
                    keyword: "Accept",
                    state: true,
                    time: new Date(),
                    orderId: snapshot.val().requestId
                });
            }
            return;
        }).catch(error => { });
        return;
    });




// notify customer that he's request is already sent to Control Panel
exports.confirmCPReciveRequest = functions.database.ref('Requests/{requestId}')
    .onCreate((snapshot, context) => {
        admin.database().ref("Users/" + snapshot.val().customerId).once('value').then(element => {
            const token = element.child("messageToken").val(),
                titleValue = "Justcall-UAE",
                bodyValue = "عميلنا العزيز لقد تم استلام طلبكم وسيقوم أحد الموظفين بالتواصل معكم بأسرع وقت ممكن. شكرا على اختياركم شركة جست كول للصيانة العامة والمقاولات \n" +
                    "Dear customer, We received your request and one of our employees will be contacting you at the soonest, thank you for choosing JustCall Cont & General Maintenance";
            // var badgeCount = element.child("badge").val(),
            // badgeNumber = parseInt(badgeCount) + 1;
            // console.log(badgeNumber);
            console.log(token);
            var payload = {
                notification: {
                    title: titleValue,
                    body: bodyValue,
                    sound: "default",
                    // badge: badgeNumber + ""
                },
                data: {
                    type: snapshot.key
                    // activity_key: "FREELANCER_POST_DETAILS"
                }
            };
            admin.messaging().sendToDevice(token, payload)
                .then((response) => {
                    var value = "NotificationCustomer/" + snapshot.val().customerId;
                    admin.database().ref(value).push().set({
                        title: titleValue,
                        message: bodyValue,
                        shown: false,
                        orderId: snapshot.key
                    });
                    // admin.database().ref("Workers/" + snapshot.val().freelancerId).update({ badge: badgeNumber });
                    return console.log("Successfully sending message:", response);
                })
                .catch((error) => {
                    return console.log("Error sending message:", error);
                });
            return;
        }).catch(error => { });

        return;
    });

exports.RattingNotification = functions.database.ref('Requests/{ReqestId}/rate')
    .onUpdate((change, context) => {
        // var ratingID = change.after.val(),
        //     message, numOfStars;
        // admin.database().ref("Ratings/" + ratingID).once('value').then(element => {
        //     message = element.val().message;
        //     numOfStars = element.val().numberOfStars;
        // }).catch(error => { });
        admin.database().ref("FreeCustomerConnection").once('value').then(snap => {
            snap.forEach(element => {
                if (element.val().requestId === change.after.ref.parent.key) {
                    admin.database().ref("Workers/" + element.val().freelancerId).once('value').then(workerSnap => {
                        const token = workerSnap.child("messageToken").val(),
                            titleValue = "Justcall-UAE",
                            bodyValue = "Customer Rate Your Request" + "\n لقد قام العميل بتقيم عملك على طلبه";
                        if (token !== undefined) {
                            var payload = {
                                notification: {
                                    title: titleValue,
                                    body: bodyValue,
                                    sound: "default",
                                    // badge: badgeNumber + ""
                                },
                                data: {
                                    type: element.val().requestId,
                                    activity_key: "FREELANCER_POST_DETAILS"
                                }
                            };
                            admin.messaging().sendToDevice(token, payload)
                                .then((response) => {
                                    var value = "NotificationFreelancer/" + element.val().freelancerId;
                                    admin.database().ref(value).push().set({
                                        title: titleValue,
                                        message: bodyValue,
                                        shown: false,
                                        orderId: element.val().requestId
                                    });
                                    // admin.database().ref("Users/" + customerId).update({ badge: badgeNumber });
                                    return console.log("Successfully sending message:", response);
                                })
                                .catch((error) => {
                                    return console.log("Error sending message:", error);
                                });
                        }
                        return;
                    }).catch(error => { });
                }
            });
            return;
        }).catch(error => { });

        return;
    });


/********************************* 
// notify Admin Mobile Application with -> 
// -> new Customer Register
// -> new Freelancer Register
// -> new Request Resive in Control panel
**********************************/
exports.adminNotification = functions.database.ref('CPNotification/{CPNotificationID}/')
    .onCreate((snapshot, context) => {
        var keyword = snapshot.val().keyword,
            titleValue = null,
            bodyValue = null,
            payload = null;
        if (keyword === "Users") {
            titleValue = "Justcall-UAE Admin";
            bodyValue = "A new user has been register successfully";
            payload = {
                notification: {
                    title: titleValue,
                    body: bodyValue,
                    sound: "default",
                    // badge: badgeNumber + ""
                },
                data: {
                    // type: snapshot.key
                    // activity_key: "FREELANCER_POST_DETAILS"
                }
            };
        }
        if (keyword === "Workers") {
            titleValue = "Justcall-UAE Admin";
            bodyValue = "A new Freelancer has been register successfully";
            payload = {
                notification: {
                    title: titleValue,
                    body: bodyValue,
                    sound: "default",
                    // badge: badgeNumber + ""
                },
                data: {
                    // type: snapshot.val().requestId
                    // activity_key: "FREELANCER_POST_DETAILS"
                }
            };
        }
        if (keyword === "Requests") {
            titleValue = "Justcall-UAE Admin";
            bodyValue = "New order have been requested, Check out more details";
            payload = {
                notification: {
                    title: titleValue,
                    body: bodyValue,
                    sound: "default",
                    // badge: badgeNumber + ""
                },
                data: {
                    type: snapshot.val().requestId
                    // activity_key: "FREELANCER_POST_DETAILS"
                }
            };
        }
        if (titleValue !== null && bodyValue !== null) {
            admin.database().ref("Admins").once('value').then(element => {
                var token = [], counter = 0;
                element.forEach(eachElement => {
                    if (eachElement.hasChild("messageTokenId")) {
                        token[counter] = eachElement.val().messageTokenId;
                    }
                });
                // var badgeCount = element.child("badge").val(),
                // badgeNumber = parseInt(badgeCount) + 1;
                // console.log(badgeNumber);
                if (token !== []) {
                    admin.messaging().sendToDevice(token, payload)
                        .then((response) => {
                            return console.log("Successfully sending message From Admin:", response);
                        })
                        .catch((error) => {
                            return console.log("Error sending message:", error);
                        });
                }
                return;
            }).catch(error => { });
        }
        return;
    });
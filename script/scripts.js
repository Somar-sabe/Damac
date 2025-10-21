(function ($) {
	("use strict");

	/*-------------------------------------------------------------------------------
	  Detect mobile device 
	-------------------------------------------------------------------------------*/

	var mobileDevice = false;

	if (
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		)
	) {
		$("html").addClass("mobile");
		mobileDevice = true;
	} else {
		$("html").addClass("no-mobile");
		mobileDevice = false;
	}

	/*-------------------------------------------------------------------------------
	  Window load
	-------------------------------------------------------------------------------*/


/*-------------------------------------------------------------------------------
	  Filter Project Carousel 
	-------------------------------------------------------------------------------*/

	$(".popup-with-form").magnificPopup({
		items: {
			src: "#contactPopup",
		},
		type: "inline",
		fixedBgPos: true,
		overflowY: "auto",
		closeBtnInside: true,
		closeOnBgClick: false,
		preloader: false,
		midClick: true,
		fixedContentPos: true,
		removalDelay: 300,
		mainClass: "my-mfp-zoom-in",
	});
	$(".popup-video").magnificPopup({
		disableOn: 700,
		type: "iframe",
		mainClass: "mfp-fade",
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		disableOn: 0,
	});

	// Check if remind later cookie exists
	var shownPopup = false;

	// $(window).scroll(function () {
	// 	if ($(this).scrollTop() > 1100 && !shownPopup) {
	// 		shownPopup = true;
	// 		$.magnificPopup.open({
	// 			items: {
	// 				src: "#contactPopup",
	// 			},
	// 			type: "inline",
	// 			fixedBgPos: true,
	// 			overflowY: "auto",
	// 			closeBtnInside: true,
	// 			closeOnBgClick: false,
	// 			preloader: false,
	// 			midClick: true,
	// 			fixedContentPos: true,
	// 			removalDelay: 300,
	// 			mainClass: "my-mfp-zoom-in",
	// 		});
	// 	}
	// });

	$(window).scroll(function () {
		if ($(this).scrollTop() > 350) {
			$("#socials").fadeIn();
		} else {
			$("#socials").fadeOut();
		}
	});

	/*-------------------------------------------------------------------------------
	  Download Brochure Popup
	-------------------------------------------------------------------------------*/

	$(".popup-with-form2").magnificPopup({
		items: {
			src: "#brochurePopup",
		},
		type: "inline",
		fixedBgPos: true,
		overflowY: "auto",
		closeBtnInside: true,
		closeOnBgClick: false,
		preloader: false,
		midClick: true,
		fixedContentPos: true,
		removalDelay: 300,
		mainClass: "my-mfp-zoom-in",
	});

	/*-------------------------------------------------------------------------------
	  Page Piling - Full Screen Sections 
	-------------------------------------------------------------------------------*/
})(jQuery);



// Email Sending Script

jQuery.validator.addMethod(
	"validate_email",
	function (value, element) {
		if (
			/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
				value
			)
		) {
			return true;
		} else {
			return false;
		}
	},
	"Please enter a valid email address."
);
// Variable to stop multiple clicks

var formSubmitting = false;

function sendPopupContact() {
    if (formSubmitting) {
        return;
    }
    formSubmitting = true;
    
    var form = jQuery("#autoPop");
    form.validate({
        rules: {
            Number: {
                required: true,
                digits: true,
            },
            email: {
                required: true,
                validate_email: true,
            },
        },
    });
    
    var isValid = form.valid();
    if (!isValid) {
        formSubmitting = false;
        return;
    }
    
    var page_url = window.location.href;
    if (page_url.indexOf("index") > -1) {
        page_url = window.location.href.replace("index.php", "");
    }
    var survey_url = page_url.split("?")[0];
    var full_survey_url = survey_url.replace(/\/$/, "");
    var userPhone = $("#auto_country_code").val() + $("#userAutoNumber").val();
    
    // Form data WITHOUT reCAPTCHA for testing
    grecaptcha.ready(function () {
		grecaptcha
			.execute("6LdczR0pAAAAAHDdOeaPKu_D-7YpYkWt_oFVKWib", { action: "submit" })
			.then(function (token) {
            var formData = {
                userName: $("#userName").val(),
                userEmail: $("#userEmail").val(),
                Phone: userPhone,
                country: $("#userCountry").val(),
                language: $("#userLanag").val(),
				mortAdvice: $("#userMortgage").is(':checked') ? $("#userMortgage").val() : '',
    //             userPropPref: $("#userPropertyPref").val(),
				// contactPref: $("#userAutoContactPref").val(),
    //             budget: $("#userAutoBudget").val(),
                utmKeyword: $("#popup_utm_keyword").val(),
                utmSource: $("#popup_utm_source").val(),
                utmGclid: $("#popup_utm_gclid").val(),
                utmFbclid: $("#popup_utm_fbclid").val(),
                pageUrl: page_url,
                "g-recaptcha-response": token,
            };
    

    if (isValid) {
    jQuery.ajax({
        url: "subpages/contact_mail.php",
        data: formData,
        type: "POST",
        beforeSend: function () {
            $(".disBtn").prop("disabled", true).html("Sending...");
            $("#loaderMain").removeClass("hidden");
            $("#autoPop")[0].reset();
        },
        success: function (data) {
            // console.log(data);
            $("#autoPop-emsg").hide();
            $("#autoPop-smsg").show();
            
            window.setTimeout(function () {
                 window.location.href = full_survey_url + "/thank-you";
            }, 1000);
        },
        error: function () {
				$("#autoPop-smsg").hide();
				$("#autoPop-emsg").show();
			},
			complete: function () {
				$(".disBtn").prop("disabled", false).html("Submit");
				$("#loaderMain").addClass("hidden");
				formSubmitting = false;
			},
    });
    } else {
        formSubmitting = false; // Reset the formSubmitting flag
    }
	});
});
}
function sendPopUpBrochure() {
	if (formSubmitting) {
		return;
	}

	formSubmitting = true;

	var form = jQuery("#brochureFormPopup");
	form.validate({
		rules: {
			Number: {
				required: true,
				digits: true,
			},
			email: {
				required: true,
				validate_email: true,
			},
		},
	});
	// Get the selected project
    var selectedProject = $("#selected_project").val();
	var isValid = form.valid();

	var page_url = window.location.href;

	if (page_url.indexOf("index") > -1) {
		page_url = window.location.href.replace("index.php", "");
	}

	var survey_url = page_url.split("?")[0];

	var full_survey_url = survey_url.replace(/\/$/, "");

	var userPhone =
		$("#brochure_Popup_country_code").val() +
		$("#userPopupBrochureNumber").val();
	// Perform reCAPTCHA v3 verification
	grecaptcha.ready(function () {
		grecaptcha
			.execute("6LdczR0pAAAAAHDdOeaPKu_D-7YpYkWt_oFVKWib", { action: "submit" })
			.then(function (token) {
				// Include reCAPTCHA response token in form data
				var formData = {
					userName: $("#userPopupBrochureName").val(),
					userEmail: $("#userPopupBrochureEmail").val(),
					Phone: userPhone,
                    language: $("#brochureLang").val(),
					yBrochure: $("#brochure_Popup_field").val(),
    				mortAdvice: $("#userPopupBrochureMortgage").is(':checked') ? $("#userPopupBrochureMortgage").val() : '',
				// 	userPropPref: $("#userPopupBrochurePropertyPref").val(),
				// 	contactPref: $("#brochurrContactPref").val(),
				// 	budget: $("#userPopupBrochureBudget").val(),
					selectedProject: selectedProject,
					utmSource: $("#brochure_Popup_utm_source").val(),
					utmMedium: $("#brochure_Popup_utm_medium").val(),
					utmCampaign: $("#brochure_Popup_utm_campaign").val(),
					utmTerm: $("#brochure_Popup_utm_term").val(),
					utmContent: $("#brochure_Popup_utm_content").val(),
					utmKeyword: $("#brochure_Popup_utm_keyword").val(),
					utmGclid: $("#brochure_Popup_gclid").val(),
					utmFbclid: $("#brochure_Popup_fbclid").val(),
					pageUrl: page_url,
					"g-recaptcha-response": token, // Include reCAPTCHA response token
				};	

	if (isValid) {
		jQuery.ajax({
			url: "subpages/contact_mail.php",
			data: formData,
			type: "POST",
			beforeSend: function () {
				$(".disBtn").prop("disabled", true).html("Sending...");
				$("#loaderPopupBrochure").removeClass("hidden");
				$("#brochureFormPopup")[0].reset();
			},
			success: function (data) {
				//console.log(data);
				$("#brochurePopup-emsg").hide();
				$("#brochurePopup-smsg").show();
				
				
				// redirect to survey after 2 seconds
				window.setTimeout(function () {
                    window.location.href = full_survey_url + "/thank-you/index.php?project=" + selectedProject;
                }, 1000);
			},
			error: function () {
				$("#brochurePopup-smsg").hide();
				$("#brochurePopup-emsg").show();
			},
			complete: function () {
				$(".disBtn").prop("disabled", false).html("Submit");
				$("#loaderPopupBrochure").addClass("hidden");
				formSubmitting = false;
			},
		});
	} else {
        formSubmitting = false; // Reset the formSubmitting flag
    }
    
			});
	});
}
function sendBookContact() {
	if (formSubmitting) {
		return;
	}

	formSubmitting = true;

	var form = jQuery("#visitPop");
	form.validate({
		rules: {
			Number: {
				required: true,
				digits: true,
			},
			email: {
				required: true,
				validate_email: true,
			},
		},
	});
	var isValid = form.valid();

	var page_url = window.location.href;

	if (page_url.indexOf("index") > -1) {
		page_url = window.location.href.replace("index.php", "");
	}

	var survey_url = page_url.split("?")[0];

	var full_survey_url = survey_url.replace(/\/$/, "");

	var userPhone =
		$("#booking_country_code").val() + $("#bookingNumberFooter").val();
	// Perform reCAPTCHA v3 verification
	grecaptcha.ready(function () {
		grecaptcha
			.execute("6LdczR0pAAAAAHDdOeaPKu_D-7YpYkWt_oFVKWib", { action: "submit" })
			.then(function (token) {
				// Include reCAPTCHA response token in form data
				var formData = {
					userName: $("#bookingUserName").val(),
					userEmail: $("#bookingUserEmail").val(),
					Phone: userPhone,
					language: $("#bookingLanag").val(),
					mortAdvice: $("#bookMortgage").is(':checked') ? $("#bookMortgage").val() : '',
					content: $("#bookingContent").val(),
				// 	userPropPref: $("#bookingPropertyPref").val(),
				// 	contactPref: $("#bookingContactPref").val(),
				// 	budget: $("#bookingBudget").val(),
					utmSource: $("#book_utm_source").val(),
					utmMedium: $("#book_utm_medium").val(),
					utmCampaign: $("#book_utm_campaign").val(),
					utmTerm: $("#book_utm_term").val(),
					utmContent: $("#book_utm_content").val(),
					utmKeyword: $("#book_utm_keyword").val(),
					utmGclid: $("#book_gclid").val(),
					utmFbclid: $("#book_fbclid").val(),
					pageUrl: page_url,
					"g-recaptcha-response": token, // Include reCAPTCHA response token
				};

	if (isValid) {
		jQuery.ajax({
			url: "subpages/contact_mail.php",
			data: formData,
			type: "POST",
			beforeSend: function () {
				$(".disBtn").prop("disabled", true).html("Sending...");
				$("#loaderBook").removeClass("hidden");
				$("#visitPop")[0].reset();
			},
			success: function (data) {
				//console.log(data);
				$("#book-emsg").hide();
				$("#book-smsg").show();
				
				
				// redirect to survey after 2 seconds
				window.setTimeout(function () {
					window.location.href = full_survey_url + "/thank-you";
				}, 1000);
			},
			error: function () {
				$("#book-smsg").hide();
				$("#book-emsg").show();
			},
			complete: function () {
				$(".disBtn").prop("disabled", false).html("Submit");
				$("#loaderBook").addClass("hidden");
				formSubmitting = false;
			},
		});
	} else {
        formSubmitting = false; // Reset the formSubmitting flag
    }
    
			});
	});
}
function sendSliderContact() {
	if (formSubmitting) {
		return;
	}

	formSubmitting = true;

	var form = jQuery("#sliderFormID");
	form.validate({
		rules: {
			Number: {
				required: true,
				digits: true,
			},
			email: {
				required: true,
				validate_email: true,
			},
		},
	});
	var isValid = form.valid();

	var page_url = window.location.href;

	if (page_url.indexOf("index") > -1) {
		page_url = window.location.href.replace("index.php", "");
	}

	var survey_url = page_url.split("?")[0];

	var full_survey_url = survey_url.replace(/\/$/, "");

	var userPhone =
		$("#Slider_country_code").val() + $("#userSliderNumber").val();
        

	// Perform reCAPTCHA v3 verification
	grecaptcha.ready(function () {
		grecaptcha
			.execute("6LdczR0pAAAAAHDdOeaPKu_D-7YpYkWt_oFVKWib", { action: "submit" })
			.then(function (token) {
				// Include reCAPTCHA response token in form data
				var formData = {
					userName: $("#userSliderName").val(),
					userEmail: $("#userSliderEmail").val(),
					Phone: userPhone,
					language: $("#sliderLanag").val(),
				// 	userPropPref: $("#userSliderPropertyPref").val(),
				// 	contactPref: $("#userContactPref").val(),
				// 	budget: $("#userBudget").val(),
					mortAdvice: $("#mortgage").is(':checked') ? $("#mortgage").val() : '',
					utmSource: $("#Slider_utm_source").val(),
					utmMedium: $("#Slider_utm_medium").val(),
					utmCampaign: $("#Slider_utm_campaign").val(),
					utmTerm: $("#Slider_utm_term").val(),
					utmContent: $("#Slider_utm_content").val(),
					utmKeyword: $("#Slider_utm_keyword").val(),
					utmGclid: $("#Slider_gclid").val(),
					utmFbclid: $("#Slider_fbclid").val(),
					pageUrl: page_url,
					"g-recaptcha-response": token, // Include reCAPTCHA response token
				};

	if (isValid) {
		jQuery.ajax({
			url: "subpages/contact_mail.php",
			data: formData,
			type: "POST",
			beforeSend: function () {
				$(".disBtn").prop("disabled", true).html("Sending...");
				$("#loaderSlider").removeClass("hidden");
				$("#sliderFormID")[0].reset(); 
			},
			success: function (data) {
				console.log(data);
				$("#Slider-emsg").hide();
				$("#Slider-smsg").show();
				
				
				// redirect to survey after 2 seconds
				window.setTimeout(function () {
					window.location.href = full_survey_url + "/thank-you";
				}, 1000);
			},
			error: function () {
				$("#Slider-smsg").hide();
				$("#Slider-emsg").show();
			},
			complete: function () {
				$(".disBtn").prop("disabled", false).html("Submit");
				$("#loaderSlider").addClass("hidden");
				formSubmitting = false;
			},
		});
	} else {
        formSubmitting = false; // Reset the formSubmitting flag
    }
    
			});
	});
}






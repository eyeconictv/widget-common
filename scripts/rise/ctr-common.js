"use strict";

// Create a module for our core Store services
var commonModule = angular.module("common", ["ngRoute"]);

commonModule.run(function (apiAuth) { apiAuth.init(); });

commonModule.controller("commonController", ["$scope", "$rootScope", "$sce", "apiAuth", "apiStore", function ($scope, $rootScope, $sce, apiAuth, apiStore) {

	$scope.authStatus = apiAuth.AUTH_STATUS_UNDEFINED; //this value is linked to the UI
	$scope.userProfilePicture = apiAuth.DEFAULT_PROFILE_PICTURE;
	$scope.messages = [];
	$scope.selectedCompanyName = "";
	$scope.selected = "list";
	$scope.canChangeCompany = false;
	$scope.companyLoaded = false;
	$scope.isDeletingCompany = false;
	$scope.isDeletingUser = false;
	$scope.isDeletingCard = false;
	$scope.showSelector = false;

	$scope.updateCartIcon = function () {
		updateShoopingCartIcon(storageGetProducts().length);
	};

	$scope.login = function () {
		apiAuth.login();
	};

	$scope.logout = function () {
		apiAuth.logout();
	};

	$scope.updateAuthStatus = function (value) {
		if ($scope.authStatus !== value) {
			$scope.authStatus = value;
			$scope.userProfileName = apiAuth.userProfileName;
			$scope.userProfileEmail = apiAuth.userProfileEmail;
			$scope.userProfilePicture = apiAuth.userProfilePicture;
		}
	};

	$scope.getSystemMessages = function () {
		if (!isPrintView) {
			if (apiAuth.isAuthed && apiAuth.userCompany) {
				apiStore.getSystemMessages().then(function (result) { $scope.renderSystemMessages(result); });
			}
		}
	};

	$scope.renderSystemMessages = function (items) {
		var messages = [];
		if (items) {
			for (var i = 0; i < items.length; i++) {
				messages.push($sce.trustAsHtml(items[i].text));
			}
		}

		$scope.messages = messages;
	};

	$scope.switchCompany = function () {
		if (apiAuth.isRiseAdmin) {
			var data = { "onChanged": $scope.setCompany, "companyId": apiAuth.selectedCompany.id };
			$rootScope.$broadcast("companySelector.open", data);
		}
	};

	$scope.setCompany = function (data) {
		apiAuth.selectedCompany = data.company;
		$scope.selectedCompanyName = data.company.name;
		$rootScope.$broadcast("company.changed", data);
	};

	$scope.resetCompany = function () {
		if (apiAuth.isRiseAdmin) {
			$scope.setCompany({ "company": apiAuth.userCompany });
		}
	};

	$scope.navigateToHomePageIfNeeded = function () {
		var addr = document.location.hash;
		if (addr !== "#/" && addr.substr(0, 10) !== "#/product/") {
			document.location.hash = "#/";
		}
	};

	$scope.$on("profile.loaded", function (event) {
		$scope.updateAuthStatus(apiAuth.authStatus);
		$scope.$apply();
		//$scope.getSystemMessages();
	});

	$scope.$on("user.signout", function (event) {
		$scope.companyLoaded = false;
		$scope.updateAuthStatus(apiAuth.authStatus);
		$scope.navigateToHomePageIfNeeded();
		//$apply is needed when user is not logged in when app loads
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	});

	$scope.$on("userCompany.loaded", function (event) {
		$scope.companyLoaded = true;
		$scope.selectedCompanyName = apiAuth.selectedCompany.name;
		$scope.canChangeCompany = apiAuth.isRiseAdmin;
		$scope.isPurchaser = apiAuth.isPurchaser;
		$scope.getSystemMessages();
	});

	/* TODO: There is probably a better way of doing this.
	   This is here to make the UI somewhat functional. */
	$scope.$on("$viewContentLoaded", function() {
		/* Style the dropdowns. */
		$(".selectpicker").selectpicker();

		/* Reset button visibility when modals are re-opened. */
		$("#company-settings-modal").on("show.bs.modal", function (e) {
			$scope.isDeletingCompany = false;
		});

		$("#user-settings-modal").on("show.bs.modal", function (e) {
			$scope.isDeletingUser = false;
		});

		$("#credit-cards-modal").on("show.bs.modal", function (e) {
			$scope.isDeletingCard = false;
		});

		/* Hide the presentation selector when the Company Settings
		   modal is closed. */
		$("#company-settings-modal").on("hide.bs.modal", function (e) {
			$(".presentation-selector").hide();
		});
	});

	$scope.deleteCompany = function () {
		$scope.isDeletingCompany = true;
	}

	$scope.deleteUser = function () {
		$scope.isDeletingUser = true;
	}

	$scope.deleteCard = function () {
		$scope.isDeletingCard = true;
	}

	$scope.setSelected = function(section) {
		$scope.selected = section;

		if (section == "list") {
			$(".presentation-list").show();
			$(".presentation-search").hide();
		}
		else {
			$(".presentation-search").show();
			$(".presentation-list").hide();
		}
	};

	$scope.isSelected = function(section) {
		return $scope.selected === section;
	}

	$scope.selectPresentation = function(e) {
		$scope.showSelector = true;
	}

	$scope.setPresentation = function(name) {
		if (name == null) {
			name = $("#presentation-id").val();
		}

		$("#presentation-name").text(name + " (ID=a6789044-ae4a-48c7-b6fd-b5d4ffea2f24)");
		$scope.showSelector = false;
	}

	$scope.closeSelector = function(name) {
		$scope.showSelector = false;
	}
}
]);
"use strict";

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
	$scope.isSelectorVisible = false;

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

	$scope.deleteCompany = function () {
		$scope.isDeletingCompany = true;
	}

	$scope.closeCompany = function () {
		$scope.isDeletingCompany = false;
		$scope.closeSelector();
	}

	$scope.deleteUser = function () {
		$scope.isDeletingUser = true;
	}

	$scope.closeUser = function () {
		$scope.isDeletingUser = false;
	}

	$scope.deleteCard = function () {
		$scope.isDeletingCard = true;
	}

	$scope.closeCard = function () {
		$scope.isDeletingCard = false;
	}

	$scope.showSelector = function() {
		$scope.isSelectorVisible = true;
	}

	$scope.showPresentationView = function(e, section) {
		$scope.selected = section;
	};

	$scope.setPresentation = function(e, name) {
		if (name == null) {
			name = $("#presentation-id").val();
		}

		$("#presentation-name").text(name + " (ID=a6789044-ae4a-48c7-b6fd-b5d4ffea2f24)");
		$scope.isSelectorVisible = false;
	}

	$scope.closeSelector = function() {
		$scope.isSelectorVisible = false;
	}

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

		/* TODO: This should be moved to some event that is called after
		   the DOM has loaded. */
		$(".selectpicker").selectpicker();
	});
}
]);
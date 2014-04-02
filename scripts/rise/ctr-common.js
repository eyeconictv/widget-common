"use strict";

// Create a module for our core Store services
var commonModule = angular.module("common", ["ngRoute"]);

commonModule.run(function (apiAuth) { apiAuth.init(); });

commonModule.controller("commonController", ["$scope", "$rootScope", "$sce", "apiAuth", "apiStore", function ($scope, $rootScope, $sce, apiAuth, apiStore) {

	$scope.authStatus = apiAuth.AUTH_STATUS_UNDEFINED; //this value is linked to the UI
	$scope.userProfilePicture = apiAuth.DEFAULT_PROFILE_PICTURE;
	$scope.messages = [];
	$scope.selectedCompanyName = "";
	$scope.canChangeCompany = false;
	$scope.companyLoaded = false;
	$scope.deleteButtonIsVisible = true;
	$scope.confirmButtonIsVisible = false;

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

	$scope.showAddSubCompany = function () {
		$("#sub-company-modal .selectpicker").selectpicker();
		$("#sub-company-modal").modal("show");
	};

	$scope.showCompanySettings = function () {
		$("#company-settings-modal .selectpicker").selectpicker();
		$("#company-settings-modal").modal("show");
	};

	$scope.showCompanyUsers = function () {
		$("#company-users-modal").modal("show");
	};

	$scope.showUserSettings = function () {
		$("#user-settings-modal .selectpicker").selectpicker();
		$("#company-users-modal").modal("hide");
		$("#user-settings-modal").modal("show");
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

	$scope.delete = function () {
		$(".confirm").show();
		$scope.deleteButtonIsVisible = false;
		$scope.confirmButtonIsVisible = true;
	}
}
]);
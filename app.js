var app = angular.module("dogApp", []);

app.controller("dogController", function ($scope, $http, $document) {
  $scope.breedName = "";
  $scope.breedDetails = {};
  $scope.showDetails = false;
  $scope.showHistory = false;
  $scope.isLoading = false;

  $scope.setTwitterShareLink = function (breedName, imageUrl) {
    var link = encodeURI("Website link: " + window.location.href + "\n\n");
    var title = encodeURIComponent(
      angular.element(document).find("title").text() + "\n\n"
    );
    var msg = encodeURIComponent(
      "Check out this dog breed: " +
        breedName +
        "\nPic URL: " +
        imageUrl +
        "\n\n"
    );

    var twitter = angular.element($document[0].querySelector("#twitter-share"));
    twitter.attr(
      "href",
      "https://twitter.com/intent/tweet?title=" +
        title +
        "&url=" +
        link +
        "&text=" +
        msg +
        "&hashtags=dogs"
    );
  };

  $scope.getDogDetails = function () {
    $scope.isLoading = true;

    var req = {
      method: "GET",
      url: "http://localhost:3000/breed/details/",
      params: { breedName: $scope.breedName },
    };

    $http(req)
      .then(function (response) {
        $scope.breedDetails = response.data;
        $scope.showDetails = true;
        $scope.setTwitterShareLink(
          $scope.breedDetails.breedName,
          $scope.breedDetails.imageUrl
        );
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        $scope.isLoading = false;
      });
  };

  $scope.getDogHistory = function () {
    var req = {
      method: "GET",
      url: "http://localhost:3000/breed/history",
    };

    $http(req)
      .then(function (response) {
        $scope.dogHistory = response.data;
        $scope.showHistory = true;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  $scope.shareDogData = function () {
    var req = {
      method: "POST",
      url: "http://localhost:3000/breed/email",
      data: {
        breed: $scope.breedDetails.breedName,
        height: $scope.breedDetails.height,
        weight: $scope.breedDetails.weight,
        lifespan: $scope.breedDetails.lifespan,
        temperament: $scope.breedDetails.temperament,
        imageUrl: $scope.breedDetails.imageUrl,
        email: $scope.user_email,
      },
    };

    $http(req)
      .then(function (response) {
        console.log(response);
        alert("Email sent!");
      })
      .catch(function (error) {
        console.log(error);
      });

    $scope.user_email = "";
  };
});

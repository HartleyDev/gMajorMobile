angular.module('gmajor.chatController', [])

.controller('ChatController', function ($scope, ChatsFactory, $location, GridTargetFactory) {
  // this shouldn't be hard coded down the line, theortically one would be able to choose from instruments
  // so this wouldn't matter. This is for for our current auto-selecting instrument
  var instruments = ['piano','drums','edm','acoustic','organ'];

  $scope.navTitle = 'Chat';

  $scope.leftButtons = [{
    type: 'button-icon icon ion-navicon',
    tap: function(e) {
        // TODO: Stuff on click
    }
  }];

  $scope.rightButtons = [];
  $scope.chatStream;
  //fill this in with code below for chatstream

  var currentChatStream = ChatsFactory.data[ChatsFactory.currentID];
  var soundBoard = new SoundBoard(currentChatStream.music);
  //this will be filled with the data for each message in the current conversation.
  //Once chatStream is filled, we will set scope.chatStream equal to it, so the conversation
  //can be rendered.
  var chatStream = [];



  var currentlyPlaying = undefined;

  var stopAllPlaying = function() {
    if(currentlyPlaying !== undefined){
      if(currentlyPlaying !== 'all') {
        $scope.chatStream[currentlyPlaying].stopThis();
      } else {
        soundBoard.stopSounds();
        $scope.playAllButtonState.style = 'button-balanced';
        $scope.playAllButtonState.icon = 'ion-play';
        $scope.playAllButtonState.text = 'Play All';
      }
    }
  };

  $scope.playAllButtonState = {
    style: 'button-balanced',
    icon: 'ion-play',
    text: 'Play All'
  };

  $scope.playAll = function() {
    if(currentlyPlaying !== 'all') {
      stopAllPlaying();
      currentlyPlaying = 'all';
      soundBoard.playInterval(function(){});
      // Update the button since we're now playing
      $scope.playAllButtonState.style = 'button-assertive';
      $scope.playAllButtonState.icon = 'ion-stop';
      $scope.playAllButtonState.text = 'Stop';
    } else {
      stopAllPlaying();
      currentlyPlaying = undefined;
    }
  };

  var playThis = function(){
    stopAllPlaying();
    currentlyPlaying = this.id;
    this.musicGrid.playInterval();
    this.buttonState.style = 'button-assertive';
    this.buttonState.icon = 'ion-stop';
  };


  var stopThis = function(){
    currentlyPlaying = undefined;
    this.musicGrid.stopSounds();
    this.buttonState.style = 'button-balanced';
    this.buttonState.icon = 'ion-play';
  };
  //the logic below for defining currentChatStream should be moved to the factory

    for ( var i = 0; i < currentChatStream.messages.length; i++ ){
    id = i;
    username = currentChatStream.authors[i];
    photoUrl = currentChatStream.photos[i];
    comment = currentChatStream.messages[i];
    musicGrid = soundBoard.Grids[i];

    togglePlay = function(){
      if(currentlyPlaying === this.id) {
        this.stopThis();
      } else {
        this.playThis();
      }
    };
    playThis = playThis,
    stopThis = stopThis,
    buttonState = {style: 'button-balanced',
                   icon: 'ion-play'}
    chatStream.push({
      id: id,
      username: username, comment: comment,
      photoUrl: photoUrl,
      musicGrid: musicGrid,
      togglePlay: togglePlay,
      playThis: playThis,
      stopThis: stopThis,
      buttonState: buttonState
    });
  };
  $scope.chatStream = chatStream;

//the code below should also be added to the factory

  $scope.addMusic = function(){
    stopAllPlaying();
    soundBoard.stopSounds();
    ChatsFactory.resetBoard(GridTargetFactory);
    // selects from existing instruments
    // just cycles through, should be able to select eventually
    grid = new Grid(instruments[$scope.chatStream.length % instruments.length], GridTargetFactory.BPM, 329.63);
    GridTargetFactory.soundBoard.Grids = soundBoard.Grids;
    GridTargetFactory.soundBoard.addGrid(grid);
    $location.url('/' + 'grid');
    ChatsFactory.firstTime = false;
  };

  $scope.$on('SideMenuNavigate', function(){
    stopAllPlaying();
  })

});

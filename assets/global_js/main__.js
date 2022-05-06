$(document).ready(function(){



	$(".logout").click(function(){

		sessionStorage.clear();
		localStorage.clear();
		location.replace("/logout");
	})

	
})
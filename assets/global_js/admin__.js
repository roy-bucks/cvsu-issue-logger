$(document).ready(function(){




//get the user name and profile 
function getUserData(){
	$.post("/admin/self/profile",function(res){

		if(! res.error){
			const data = {
				img: res.data.image,
				first_name: res.data.first_name,
				last_name: res.data.last_name
			}
			localStorage.setItem("profile", JSON.stringify(data));
			setProfile();
		}
	})
}

function setProfile(){

	const profile = JSON.parse(localStorage.getItem("profile"));

	if(profile != null){
		$(".profile-image").attr("src", profile.img)
		$(".profile-name").text(profile.first_name + " "+ profile.last_name)
	}
	else{
		getUserData(); 
	}
}
 // getUserData();
setProfile();


$(".logout").click(function(){

	sessionStorage.clear();
	localStorage.clear();
	location.replace("/logout");
})


})
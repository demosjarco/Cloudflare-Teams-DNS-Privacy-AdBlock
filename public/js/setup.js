const myModal = document.getElementById('setupModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', function () {
	myInput.focus()
})
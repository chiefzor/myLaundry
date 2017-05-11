var checkboxes = $("input[type='checkbox']");
var isFirstcheck = true;

function toggleChevron(e) {
$(e.target)
		.prev('.panel-heading')
		.find("i.indicator")
		.toggleClass('fa-caret-down fa-caret-right');
}
$(checkboxes).change(function() {
    if(this.checked) {
		$('.' + this.value).show()
    }
	else {
		$('.' + this.value).hide()
	}
});

$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);
/* Base HTML layout for trip entry*/
function getEntryHtml(id) {
    return `<div class="entry" id="${id}">
            <div class="image_holder">
                <img class="trip_image">
                <div class="image_cover">
                    <h2 class="trip_name"></h2>
                    <div class="trip_due_days"></div>
                     <div class="weather_forecast">
                        <div class="weather_temps">*</div>
                        <div class="weather_icon"></div>
                     </div>
                </div>
                <div class="entry_actions">
                    <button type="button" class="button_save_entry">Save</button>
                    <button type="button" class="button_delete_entry">Delete</button>
                </div>
            </div>
            <div class="trip_info">
                <div class="city_search">
                    <input type="text" class="city_search_input" autocomplete="off" placeholder="City">
                </div>
                <div class="dates_selection">
                    <input class="date_from" type="date" placeholder="FROM">
                    <input class="date_to" type="date" placeholder="FROM">
                </div>
                <div class="package_items">
                    <div class="package_header">
                        <h3 class="package_title">Package items</h3>
                        <button type="button" class="button_add_item">Add</button>
                    </div>
                </div>
            </div>
        </div>`
}

module.exports = {
    getEntryHtml
}
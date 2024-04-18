export function removeCustomMarker() {
  // Get the custom marker element
  let customMarker = document.querySelector(".custom-marker");

  // Remove the custom marker from the map
  if (customMarker) {
    customMarker.parentNode.removeChild(customMarker);
  }
}

import pin from "../assets/images/pin.png";

export function createMarkerElement() {
  let container = document.createElement("div");
  container.className = "deleteCustomMarkerContainer";

  // Создайте элемент маркера
  let marker = document.createElement("div");
  marker.className = "custom-marker";
  marker.style.backgroundImage = `url(${pin})`;
  marker.style.width = "50px";
  marker.style.height = "50px";
  marker.draggable = true;
  marker.style.backgroundSize = 'cover';
  marker.style.backgroundPosition = 'center';

  // Создайте кнопку удаления
  let deleteButton = document.createElement("button");
  deleteButton.innerText = "×";
  deleteButton.className = "delete-button";

  // Добавьте обработчик события на кнопку удаления
  deleteButton.addEventListener("click", function () {
    // Удалите маркер и его контейнер из карты
    container.remove();
  });

  // Добавьте маркер и кнопку в контейнер
  container.appendChild(marker);
  container.appendChild(deleteButton);

  return container;
}

export function toggleDistrictsVisibility(selectedDistricts, map) {
  var districtsToShow = [];

  if (selectedDistricts.length === 0) {
    // districtsToShow.push(["!=", ["get", "sidebar_label"], ""]);
  } else {
    selectedDistricts.forEach(function (district) {
      districtsToShow.push(["==", ["get", "sidebar_label"], district]);
    });
  }

  map.setFilter("districts-brussels-0-2", ["any"].concat(districtsToShow));

  // Обновите карту
  map.triggerRepaint();
}

export function toggleButton(data, selectedDistricts, map) {
  const districtIndex = selectedDistricts.indexOf(data);

  if (districtIndex === -1) {
    // Если район не выбран, добавьте его в список
    selectedDistricts.push(data);
  } else {
    // Если район уже выбран, удалите его из списка
    selectedDistricts.splice(districtIndex, 1);
  }
  // Переключите видимость всех районов
  toggleDistrictsVisibility(selectedDistricts, map);
}

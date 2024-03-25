import html2canvas from "html2canvas";

const PrintScreen = ({showTool, toggleToolbar}) => {
  function downloadMapHandler() {
    const mapElement = document.getElementById('map');
    if(!showTool) toggleToolbar();

    if (mapElement) {
      html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true
      }).then(canvas => {

        console.log(showTool);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = "test.png";
        a.href = canvas.toDataURL();
        a.click();
      });
    } else {
      console.error('Map element not found.');
    }
  }

  return (
    <button onClick={downloadMapHandler} className="PrintScreen">
      DOWNLOAD YOUR MAP
    </button>
  );
};

export default PrintScreen;

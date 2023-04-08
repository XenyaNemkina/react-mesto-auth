function InfoToolTip({ message, onClose }) {
  return (
    <div className={"popup " + (message ? "popup_is-opened" : "")}>
      <div className="popup__container">
        <button className="popup__close" type="button" onClick={onClose} />
        <div className={"popup__infotooltip" + (message ? (message.isSuccess ? " popup__infotooltip_success" : " popup__infotooltip_fail") : "")} />
        <h2 className="popup__infotooltip_message">{message ? message.text : ""}</h2>
      </div>
    </div>
  );
}

export default InfoToolTip;

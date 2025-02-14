import styles from "./styles.module.scss";

export default function EditArea() {
  return (
    <div className={styles.container}>
      <h3>3. Edit an Area</h3>

      <img
        src={"/images/edit-area.png"}
        className={styles.image}
        alt="Grid options"
      />

      <div className={styles.content}>
        <p>To move an area:</p>

        <ol>
          <li>Click the Move Icon at the bottom of the area.</li>
          <li>
            Drag the area to its new location by pointing the top-left corner of
            the area where you want it placed.
          </li>
          <li>Release to drop the area in position.</li>
        </ol>

        <br />

        <p>
          You can resize an area using the Resize Handle at the bottom-right
          corner. Click and drag the handle to adjust the size. For mobile
          devices, the handles within the areas are unavailable. Instead, you
          can use the Area Options to configure properties manually:
        </p>

        <ol>
          <li>row-start: Specify the starting row.</li>
          <li>column-start: Set the starting column.</li>
          <li>row-end: Define the ending row.</li>
          <li>column-end: Specify the ending column.</li>
        </ol>
      </div>
    </div>
  );
}

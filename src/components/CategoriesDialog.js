import React from "react";
import CategoryBlock from "./stateless/CategoryBlock";
import Draggable from "react-draggable";
import HelpTip from "./stateless/HelpTip";
import "./CategoriesDialog.css";

class CategoriesDialog extends React.Component {
  render() {
    return (
      <Draggable handle=".handle" bounds="parent">
        <div
          id="yourCategories"
          className={this.props.editMode === 1 ? "active" : ""}
        >
          <div className="handle"></div>
          <div className="titleBlock">
            <div>
              <h2>your categories</h2>
              <HelpTip
                title="your categories"
                text="These are that categories that you define by relabeling existing categories. You need to define your own categories before creating data. To start defining categories click on the define categories button."
              />
            </div>
            <p>
              {this.props.categories.length === 0
                ? "You haven't defined any categories yet. Click on create categories to start."
                : ""}
            </p>
          </div>
          <div className="scrollBlock">
            {this.props.categories.map((category, index) => (
              <CategoryBlock
                category={category.name}
                relabel={category.relabel}
                description={category.description}
                key={index}
                index={index}
              />
            ))}
          </div>
        </div>
      </Draggable>
    );
  }
}

export default CategoriesDialog;

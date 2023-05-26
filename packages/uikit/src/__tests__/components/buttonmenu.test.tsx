import { vi } from "vitest";
import { renderWithProvider } from "../../testHelpers";
import ButtonMenu from "../../components/ButtonMenu/ButtonMenu";
import ButtonMenuItem from "../../components/ButtonMenu/ButtonMenuItem";

const handleClick = vi.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <ButtonMenu activeIndex={0} onItemClick={handleClick}>
      <ButtonMenuItem>Item 1</ButtonMenuItem>
      <ButtonMenuItem>Item 2</ButtonMenuItem>
    </ButtonMenu>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c1 {
      position: relative;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      border: 0;
      border-radius: 10px;
      box-shadow: 0px -1px 0px 0px rgba(14,14,44,0.4) inset;
      cursor: pointer;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-letter-spacing: 0.03em;
      -moz-letter-spacing: 0.03em;
      -ms-letter-spacing: 0.03em;
      letter-spacing: 0.03em;
      line-height: 1;
      opacity: 1;
      outline: 0;
      -webkit-transition: background-color 0.2s,opacity 0.2s;
      transition: background-color 0.2s,opacity 0.2s;
      height: 48px;
      padding: 0 24px;
      background-color: var(--colors-primary);
      color: var(--colors-invertedContrast);
    }

    .c1:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c1:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c1:disabled,
    .c1.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c0 {
      background-color: var(--colors-tertiary);
      border-radius: 10px;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      border: 1px solid var(--colors-disabled);
      width: auto;
    }

    .c0 > button,
    .c0 > a {
      -webkit-flex: auto;
      -ms-flex: auto;
      flex: auto;
    }

    .c0 > button + button,
    .c0 > a + a {
      margin-left: 2px;
    }

    .c0 > button,
    .c0 a {
      box-shadow: none;
    }

    .c2 {
      background-color: transparent;
      color: var(--colors-primary);
    }

    .c2:hover:not(:disabled):not(:active) {
      background-color: transparent;
    }

    <div
        class="c0"
      >
        <button
          class="c1"
          scale="md"
        >
          Item 1
        </button>
        <button
          class="c1 c2"
          scale="md"
        >
          Item 2
        </button>
      </div>
    </DocumentFragment>
  `);
});
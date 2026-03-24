import { useIntl } from "react-intl";
import { Sketch } from "@uiw/react-color";

type Props = {
  name: string;
  value?: unknown;
  disabled?: boolean;
  intlLabel?: { id: string; defaultMessage: string };
  onChange: (event: { target: { name: string; value: unknown } }) => void;
};

const DEFAULT_RGBA = "rgba(0,0,0,0.04)";

function normalizeToCssColor(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) return value;
  return DEFAULT_RGBA;
}

export default function SelectionBackgroundColorInput(props: Props) {
  const { formatMessage } = useIntl();
  const { name, value, disabled, intlLabel, onChange } = props;

  const color = normalizeToCssColor(value);

  return (
    <div style={{ opacity: disabled ? 0.6 : 1 }}>
      {intlLabel && <div style={{ marginBottom: 8 }}>{formatMessage(intlLabel)}</div>}
      <div style={{ pointerEvents: disabled ? "none" : "auto" }}>
        <Sketch
          color={color}
          disableAlpha={false}
          presetColors={false}
          onChange={(nextColor) => {
            // Sketch onChange 返回 ColorResult：包含 hex / hexa(#RRGGBBAA) / rgba(having a)
            const out = (nextColor as { hexa?: string; hex?: string }).hexa ?? (nextColor as { hex?: string }).hex ?? DEFAULT_RGBA;
            onChange({ target: { name, value: out } });
          }}
        />
      </div>
    </div>
  );
}


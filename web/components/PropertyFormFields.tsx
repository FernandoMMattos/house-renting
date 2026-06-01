import Input from "@/components/Input";
import Select from "@/components/Select";
import FormField from "@/components/FormField";

export interface PropertyFormValues {
  street: string;
  number: string;
  areaCode: string;
  eirCode: string;
  propertyType: string;
  roomType: string;
  bedrooms: string;
  bathrooms: string;
  people: string;
  price: string;
  availableFrom: string;
  availableFor: string;
  description: string;
}

interface Props {
  values: PropertyFormValues;
  onChange: (field: keyof PropertyFormValues, value: string) => void;
}

const dateToInput = (iso: string) => iso?.slice(0, 10) ?? "";

const PropertyFormFields = ({ values, onChange }: Props) => {
  const field =
    (name: keyof PropertyFormValues) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      onChange(name, e.target.value);

  return (
    <>
      <FormField label="Street" htmlFor="street">
        <Input
          id="street"
          name="street"
          placeholder="Ex: Northwood Ave."
          value={values.street}
          onChange={field("street")}
          required
        />
      </FormField>

      <FormField label="Number" htmlFor="number">
        <Input
          id="number"
          name="number"
          type="number"
          placeholder="Use only number"
          value={values.number}
          onChange={field("number")}
          required
        />
      </FormField>

      <FormField label="Area Code" htmlFor="areaCode">
        <Input
          id="areaCode"
          name="areaCode"
          type="number"
          placeholder="Ex: 9 for Dublin 9"
          max={24}
          value={values.areaCode}
          onChange={field("areaCode")}
          required
        />
      </FormField>

      <FormField label="Eir Code" htmlFor="eirCode">
        <Input
          id="eirCode"
          name="eirCode"
          placeholder="Ex: D01LM87"
          pattern="^D\d{2}\s?[A-Z0-9]{4}$"
          value={values.eirCode}
          onChange={field("eirCode")}
          required
        />
      </FormField>

      <FormField label="Type of Property" htmlFor="propertyType">
        <Select
          id="propertyType"
          name="propertyType"
          value={values.propertyType}
          onChange={field("propertyType")}
          required
        >
          <option value="house">House</option>
          <option value="flat">Flat</option>
          <option value="apartment">Apartment</option>
        </Select>
      </FormField>

      <FormField label="Room type" htmlFor="roomType">
        <Select
          id="roomType"
          name="roomType"
          value={values.roomType}
          onChange={field("roomType")}
          required
        >
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="sharing">Sharing</option>
        </Select>
      </FormField>

      <FormField label="Bedrooms" htmlFor="bedrooms">
        <Input
          id="bedrooms"
          name="bedrooms"
          type="number"
          min="1"
          max="5"
          value={values.bedrooms}
          onChange={field("bedrooms")}
          required
        />
      </FormField>

      <FormField label="Bathrooms" htmlFor="bathrooms">
        <Input
          id="bathrooms"
          name="bathrooms"
          type="number"
          min="1"
          max="5"
          value={values.bathrooms}
          onChange={field("bathrooms")}
          required
        />
      </FormField>

      <FormField label="People Sharing?" htmlFor="people">
        <Input
          id="people"
          name="people"
          type="number"
          max="20"
          value={values.people}
          onChange={field("people")}
          required
        />
      </FormField>

      <FormField label="Price per month" htmlFor="price">
        <Input
          id="price"
          name="price"
          type="number"
          value={values.price}
          onChange={field("price")}
          required
        />
      </FormField>

      <FormField label="Available From" htmlFor="availableFrom">
        <input
          id="availableFrom"
          name="availableFrom"
          type="date"
          value={dateToInput(values.availableFrom)}
          onChange={field("availableFrom")}
          className="w-full rounded-2xl border-2 border-gray-800 p-2 focus:outline-none cursor-pointer"
          required
        />
      </FormField>

      <FormField label="Available Until" htmlFor="availableFor">
        <input
          id="availableFor"
          name="availableFor"
          type="date"
          value={dateToInput(values.availableFor)}
          onChange={field("availableFor")}
          className="w-full rounded-2xl border-2 border-gray-800 p-2 focus:outline-none cursor-pointer"
          required
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        className="md:col-span-2"
      >
        <textarea
          id="description"
          name="description"
          rows={7}
          placeholder="Describe the room, house, location, transport options..."
          value={values.description}
          onChange={field("description")}
          className="w-full rounded-2xl border-2 border-gray-800 p-4 resize-y focus:outline-none"
          required
        />
      </FormField>
    </>
  );
};

export default PropertyFormFields;

import { useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
import "./styles.css";
interface FormValues {
  label: string;
  churnCount: number;
  attempts?: number;
  difficulty?: number;
  failures?: string;
  newAttributes: {
    attribute: string;
    value: string;
  }[];
}

interface ModalFormProps {
  modalFormIsOpen: any;
  closeModal: any;
  primaryNode: any;
  onSubmitNode: any;
  selectedEdge: any;
  onSubmitEdge: any;
}

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const ModalForm = ({
  modalFormIsOpen,
  closeModal,
  primaryNode,
  onSubmitNode,
  selectedEdge,
  onSubmitEdge,
}: ModalFormProps) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      newAttributes: [{ attribute: "", value: "" }],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "newAttributes",
    control,
  });

  return (
    <Modal
      isOpen={modalFormIsOpen}
      onRequestClose={closeModal}
      style={modalStyles}
      ariaHideApp={false}
      contentLabel="modal-form"
    >
      {primaryNode && (
        <form onSubmit={handleSubmit(onSubmitNode)}>
          <div className="formContainer">
            <div className="formInput">
              <h3>Label</h3>
              <input
                {...register("label")}
                defaultValue={primaryNode?.label}
                placeholder="Label"
              />
            </div>

            <div className="formInput">
              <h3>Churn Count</h3>
              <input
                type="number"
                {...register("churnCount", {
                  valueAsNumber: true,
                  required: true,
                })}
                defaultValue={primaryNode?.churnCount}
              />
            </div>

            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <section className={"section"} key={field.id}>
                    <input
                      placeholder="attribute"
                      {...register(
                        `newAttributes.${index}.attribute` as const,
                        {}
                      )}
                      defaultValue={field.attribute}
                    />
                    <input
                      placeholder="name"
                      {...register(`newAttributes.${index}.value` as const, {})}
                      defaultValue={field.value}
                    />

                    <button type="button" onClick={() => remove(index)}>
                      DELETE
                    </button>
                  </section>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() =>
                append({
                  attribute: "",
                  value: "",
                })
              }
            >
              APPEND
            </button>
            <input type="submit" />
          </div>
        </form>
      )}

      {selectedEdge && (
        <form onSubmit={handleSubmit(onSubmitEdge)}>
          <div className="formContainer">
            <div className="formInput">
              <h3>Label</h3>
              <input
                {...register("label")}
                defaultValue={selectedEdge?.label}
                placeholder="Label"
              />
            </div>

            <div className="formInput">
              <h3>Difficulty</h3>
              <input
                type="number"
                {...register("difficulty", {
                  valueAsNumber: true,
                  required: true,
                })}
                defaultValue={selectedEdge?.difficulty}
              />
            </div>
            <div className="formInput">
              <h3>attempts</h3>
              <input
                type="number"
                {...register("attempts", {
                  valueAsNumber: true,
                  required: true,
                })}
                defaultValue={selectedEdge?.attempts}
              />
            </div>
            <div className="formInput">
              <h3>failures</h3>
              <input
                type="number"
                {...register("failures", {
                  valueAsNumber: true,
                  required: true,
                })}
                defaultValue={selectedEdge?.failures}
              />
            </div>
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <section className={"section"} key={field.id}>
                    <input
                      placeholder="attribute"
                      {...register(
                        `newAttributes.${index}.attribute` as const,
                        {}
                      )}
                      defaultValue={field.attribute}
                    />
                    <input
                      placeholder="name"
                      {...register(`newAttributes.${index}.value` as const, {})}
                      defaultValue={field.value}
                    />

                    <button type="button" onClick={() => remove(index)}>
                      DELETE
                    </button>
                  </section>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() =>
                append({
                  attribute: "",
                  value: "",
                })
              }
            >
              APPEND
            </button>
            <input type="submit" />
          </div>
        </form>
      )}
    </Modal>
  );
};

export { ModalForm };

import { useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
import "./styles.css";
interface FormValues {
  label: string;
  churnCount: number;
  boredomChurnCount: number;
  attempts?: number;
  difficulty?: number;
  failures?: number;
  probabilityOfWinning?: number;
  newAttributes: {
    attribute: string;
    value: string;
  }[];
}

interface ModalFormProps {
  modalFormIsOpen: any;
  setIsModalFormOpen: any;
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
  const { register, control, reset, handleSubmit } = useForm<FormValues>({
    mode: "onBlur",
  });

  const {
    register: registerEdge,
    handleSubmit: handleSubmitEdge,
    reset: resetEdge,
  } = useForm<FormValues>();

  const { fields, append, remove } = useFieldArray({
    name: "newAttributes",
    control,
  });

  const resetFormValue = () => {
    reset();
    resetEdge();
  };

  return (
    <Modal
      isOpen={modalFormIsOpen}
      onRequestClose={closeModal}
      onAfterClose={resetFormValue}
      style={modalStyles}
      ariaHideApp={false}
      contentLabel="modal-form"
    >
      {primaryNode && (
        <>
          <div className="titleContainerModal">
            <h3 className="title">Edit node </h3>
            <span onClick={closeModal} className="closeButton">X</span>
          </div>

          <form onSubmit={handleSubmit(onSubmitNode)}>
            <div className="formContainerModal">
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
              <div className="formInput">
                <h3>Churn Count</h3>
                <input
                  type="number"
                  {...register("boredomChurnCount", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  defaultValue={primaryNode?.boredomChurnCount}
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
                        {...register(
                          `newAttributes.${index}.value` as const,
                          {}
                        )}
                        defaultValue={field.value}
                      />

                      <button type="button" onClick={() => remove(index)}>
                        DELETE
                      </button>
                    </section>
                  </div>
                );
              })}
            </div>
            <div className="buttonContainerModal">
              <button onClick={closeModal} className="cancelButton">
                Cancel
              </button>
              <input  className="submitModalButton" type="submit" value="Save" />
            </div>
          </form>
        </>
      )}

      {selectedEdge && (
        <>
          <div className="titleContainerModal">
            <h3 className="title">Edit edge </h3>
            <span  className="closeButton" onClick={closeModal}>X</span>
          </div>
          <form onSubmit={handleSubmitEdge(onSubmitEdge)}>
            <div className="formContainerModal">
              <div className="formInput">
                <h3>Label</h3>
                <input
                  {...registerEdge("label")}
                  defaultValue={selectedEdge?.label}
                  placeholder="Label"
                />
              </div>

              <div className="formInput">
                <h3>Difficulty</h3>
                <input
                  type="number"
                  {...registerEdge("difficulty", {
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
                  {...registerEdge("attempts", {
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
                  {...registerEdge("failures", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  defaultValue={selectedEdge?.failures}
                />
              </div>
              <div className="formInput">
                <h3>Probability of winning</h3>
                <input
                  type="number"
                  {...registerEdge("probabilityOfWinning", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  defaultValue={selectedEdge?.probabilityOfWinning}
                />
              </div>
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className={"section"} key={field.id}>
                      <input
                        placeholder="attribute"
                        {...registerEdge(
                          `newAttributes.${index}.attribute` as const,
                          {}
                        )}
                        defaultValue={field.attribute}
                      />
                      <input
                        placeholder="name"
                        {...registerEdge(
                          `newAttributes.${index}.value` as const,
                          {}
                        )}
                        defaultValue={field.value}
                      />

                      <button type="button" onClick={() => remove(index)}>
                        DELETE
                      </button>
                    </section>
                  </div>
                );
              })}
            </div>
            <div className="buttonContainerModal">
              <button onClick={closeModal} className="cancelButton">
                Cancel
              </button>
              <input  className="submitModalButton" type="submit" value="Save" />
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

export { ModalForm };

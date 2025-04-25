import React, { useState } from "react";
import moment from 'moment'
import { toast } from "react-toastify";
import { useDeleteReportMutation, useGenerateReportsMutation, useGetRevisionReportsQuery, useUpdateClientInfoMutation } from "../../services/apiSlice";
import { useDispatch } from "react-redux";
import Swal from 'sweetalert2'
import { setIsUpdate, setPageOpen } from "../../store/pageSlice";
import Loader from "../../lib/loader/loader";
const ReportComponentElement = ({ areas, page , inspectionData, areadata}) => {
  const id_order = localStorage.getItem('ispenzioEditID')
  const dispatch = useDispatch();
  const client = sessionStorage.getItem('client_info')
  const client2 = sessionStorage.getItem('creator_info')
  // Local state to manage form inputs
  const [formData, setFormData] = useState({
    id_order: inspectionData?.data?.id_order,
    client_info: client ? client :  inspectionData?.data?.client_info || "",
    creator_info: client2 ? client2 :  inspectionData?.data?.creator_info || "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [updateClientInfo] = useUpdateClientInfoMutation();
  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    // Here you can dispatch an action or send the form data to an API
    await updateClientInfo({
    body: formData
    }).unwrap()
    .then((res) =>{
      sessionStorage.setItem('client_info', res?.client_info)
      sessionStorage.setItem('creator_info', res?.creator_info)
      setFormData((prev) => ({
        ...prev,
        client_info: res?.client_info || prev?.client_info,
        creater_info: res?.creator_info || prev?.creator_info,
      }));
      dispatch(setIsUpdate(1))
      toast.success(res?.message)

    }).catch((err) => console.log(err))
   
  };

  return (
    <div>
      <div className="container-fluid p-0">
        <a href="javascript:void(0);" className="dashIconFold" id="foldBtn" onClick={() => dispatch(setPageOpen(true))}>
          <div className="folded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="17"
              viewBox="0 0 6 10"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.603669 0.690378C0.802481 0.497088 1.12482 0.497088 1.32363 0.690377L5.39636 4.64997C5.49183 4.74279 5.54547 4.86869 5.54547 4.99996C5.54547 5.13122 5.49183 5.25712 5.39636 5.34994L1.32363 9.30953C1.12482 9.50282 0.802481 9.50282 0.603669 9.30953C0.404856 9.11624 0.404856 8.80286 0.603669 8.60957L4.31641 4.99996L0.603669 1.39034C0.404856 1.19705 0.404856 0.883667 0.603669 0.690378Z"
                fill="#ECAD42"
              />
            </svg>
          </div>
        </a>
        <div className="contentBox">
          <a href="/report" className="close-iconBtn">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.05096 1.10498C1.21899 0.936596 1.41859 0.803006 1.63831 0.711857C1.85804 0.620708 2.09358 0.573792 2.33146 0.573792C2.56934 0.573792 2.80489 0.620708 3.02462 0.711857C3.24434 0.803006 3.44393 0.936596 3.61196 1.10498L13.184 10.681L22.756 1.10498C23.0968 0.771233 23.5555 0.58543 24.0325 0.587931C24.5095 0.590431 24.9663 0.781033 25.3036 1.11834C25.6409 1.45564 25.8315 1.9124 25.834 2.38941C25.8365 2.86642 25.6507 3.32516 25.317 3.66598L15.741 13.238L25.317 22.81C25.6507 23.1508 25.8365 23.6095 25.834 24.0865C25.8315 24.5636 25.6409 25.0203 25.3036 25.3576C24.9663 25.6949 24.5095 25.8855 24.0325 25.888C23.5555 25.8905 23.0968 25.7047 22.756 25.371L13.184 15.795L3.61196 25.371C3.27114 25.7047 2.81241 25.8905 2.3354 25.888C1.85838 25.8855 1.40162 25.6949 1.06432 25.3576C0.727017 25.0203 0.536415 24.5636 0.533915 24.0865C0.531414 23.6095 0.717216 23.1508 1.05096 22.81L10.627 13.238L1.05096 3.66598C0.88258 3.49795 0.748989 3.29836 0.657841 3.07863C0.566692 2.85891 0.519775 2.62336 0.519775 2.38548C0.519775 2.1476 0.566692 1.91205 0.657841 1.69233C0.748989 1.4726 0.88258 1.27301 1.05096 1.10498Z"
                fill="currentcolor"
              />
            </svg>
          </a>
          <div class="reportHeader">
            <div>Ispezione | {inspectionData?.data?.client}</div>
            <div>{inspectionData?.data?.order_code}</div>
            <div>
              Data Inizio Ispezione
              <span> {moment(inspectionData?.data?.create_at).format('DD-MM-YYYY')}</span>
            </div>
          </div>
          <div className="report_innerBox">
            {/* Report Content */}
            {parseInt(page) === 0 && <div>
               <form onSubmit={handleSubmit} className="report_innerBox">
            <div className="row">
              <h4 className="report_formTitle">Descrizione</h4>
              <div className="col-md-12 w-100">
                <div className="form-floating">
                  <input type="text" className="form-control" id="floatingInput"
                    value={inspectionData?.data?.description} />

                </div>
              </div>
              <div className="col-lg-6">
                <div className="report_formBox">
                  <h4 className="report_formTitle">Rilasciato a</h4>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingCreatedBy"
                        name="client_info"
                        placeholder="Rilasciato a"
                        value={formData.client_info}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="report_formBox">
                  <h4 className="report_formTitle">Creatore di ispezioni</h4>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInspectionDate"
                        name="creator_info"
                        placeholder="Creatore di ispezioni"
                        value={formData.creator_info}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 w-100 d-flex justify-content-end">
              <button type="submit" className="btn btn-primary text-center">
                Salva
              </button>
            </div>
          </form>
            </div>}

            {/* Report Equepment */}

           {parseInt(page) === 1 && <div>
              <div className="table-responsive tableFont24">
                <table className="table mb-0">
                  <thead className="thbold">
                    <tr>
                      <th scope="col">Macchinario | Modello</th>
                      <th scope="col">Ambito Legislativo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionData?.data?.inspections?.map((value, index) =>(
                                            <tr key={index}>
                                                <td>
                                                <button className="switchEquipment">
                                                <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3.33792 1.74699C3.33792 2.00663 3.26093 2.26045 3.1167 2.47635C2.97247 2.69225 2.76747 2.86054 2.52761 2.95995C2.28775 3.05936 2.0238 3.08542 1.76913 3.03483C1.51446 2.98425 1.2805 2.8593 1.09684 2.67578C0.913171 2.49225 0.788041 2.25839 0.737266 2.00376C0.68649 1.74913 0.712349 1.48516 0.811574 1.24522C0.910799 1.00528 1.07893 0.800152 1.29472 0.655757C1.51051 0.511363 1.76427 0.434189 2.02391 0.433991C2.19642 0.433859 2.36727 0.467724 2.52668 0.53365C2.6861 0.599575 2.83096 0.69627 2.95299 0.818206C3.07502 0.940143 3.17183 1.08493 3.23787 1.2443C3.30392 1.40366 3.33792 1.57448 3.33792 1.74699Z" fill="#9B9696"/>
                                                <path d="M3.33792 12.253C3.33792 12.5126 3.26093 12.7665 3.1167 12.9824C2.97247 13.1983 2.76747 13.3666 2.52761 13.466C2.28775 13.5654 2.0238 13.5914 1.76913 13.5408C1.51446 13.4903 1.2805 13.3653 1.09684 13.1818C0.913171 12.9983 0.788041 12.7644 0.737266 12.5098C0.68649 12.2551 0.712349 11.9912 0.811574 11.7512C0.910799 11.5113 1.07893 11.3062 1.29472 11.1618C1.51051 11.0174 1.76427 10.9402 2.02391 10.94C2.19642 10.9399 2.36727 10.9737 2.52668 11.0397C2.6861 11.1056 2.83096 11.2023 2.95299 11.3242C3.07502 11.4462 3.17183 11.5909 3.23787 11.7503C3.30392 11.9097 3.33792 12.0805 3.33792 12.253Z" fill="#9B9696"/>
                                                <path d="M8.59231 1.74699C8.59231 2.00663 8.51533 2.26045 8.3711 2.47635C8.22687 2.69225 8.02186 2.86054 7.782 2.95995C7.54214 3.05936 7.27819 3.08542 7.02352 3.03483C6.76885 2.98425 6.5349 2.8593 6.35123 2.67578C6.16756 2.49225 6.04244 2.25839 5.99166 2.00376C5.94088 1.74913 5.96674 1.48516 6.06597 1.24522C6.16519 1.00528 6.33333 0.800152 6.54912 0.655757C6.76491 0.511363 7.01866 0.434189 7.27831 0.433991C7.45082 0.433859 7.62166 0.467724 7.78108 0.53365C7.9405 0.599575 8.08536 0.69627 8.20739 0.818206C8.32941 0.940143 8.42622 1.08493 8.49227 1.2443C8.55831 1.40366 8.59231 1.57448 8.59231 1.74699Z" fill="#9B9696"/>
                                                <path d="M8.59231 12.253C8.59231 12.5126 8.51533 12.7665 8.3711 12.9824C8.22687 13.1983 8.02186 13.3666 7.782 13.466C7.54214 13.5654 7.27819 13.5914 7.02352 13.5408C6.76885 13.4903 6.5349 13.3653 6.35123 13.1818C6.16756 12.9983 6.04244 12.7644 5.99166 12.5098C5.94088 12.2551 5.96674 11.9912 6.06597 11.7512C6.16519 11.5113 6.33333 11.3062 6.54912 11.1618C6.76491 11.0174 7.01866 10.9402 7.27831 10.94C7.45082 10.9399 7.62166 10.9737 7.78108 11.0397C7.9405 11.1056 8.08536 11.2023 8.20739 11.3242C8.32941 11.4462 8.42622 11.5909 8.49227 11.7503C8.55831 11.9097 8.59231 12.0805 8.59231 12.253Z" fill="#9B9696"/>
                                                <path d="M8.59231 7.00001C8.59231 7.25966 8.51533 7.51347 8.3711 7.72937C8.22687 7.94527 8.02186 8.11356 7.782 8.21297C7.54214 8.31238 7.27819 8.33844 7.02352 8.28786C6.76885 8.23727 6.5349 8.11232 6.35123 7.9288C6.16756 7.74527 6.04244 7.51141 5.99166 7.25678C5.94088 7.00215 5.96674 6.73818 6.06597 6.49824C6.16519 6.25831 6.33333 6.05317 6.54912 5.90878C6.76491 5.76438 7.01866 5.68721 7.27831 5.68701C7.45082 5.68688 7.62166 5.72075 7.78108 5.78667C7.9405 5.8526 8.08536 5.94929 8.20739 6.07123C8.32941 6.19316 8.42622 6.33795 8.49227 6.49732C8.55831 6.65668 8.59231 6.8275 8.59231 7.00001Z" fill="#9B9696"/>
                                                <path d="M3.33792 7.00001C3.33792 7.25966 3.26093 7.51347 3.1167 7.72937C2.97247 7.94527 2.76747 8.11356 2.52761 8.21297C2.28775 8.31238 2.0238 8.33844 1.76913 8.28786C1.51446 8.23727 1.2805 8.11232 1.09684 7.9288C0.913171 7.74527 0.788041 7.51141 0.737266 7.25678C0.68649 7.00215 0.712349 6.73818 0.811574 6.49824C0.910799 6.25831 1.07893 6.05317 1.29472 5.90878C1.51051 5.76438 1.76427 5.68721 2.02391 5.68701C2.19642 5.68688 2.36727 5.72075 2.52668 5.78667C2.6861 5.8526 2.83096 5.94929 2.95299 6.07123C3.07502 6.19316 3.17183 6.33795 3.23787 6.49732C3.30392 6.65668 3.33792 6.8275 3.33792 7.00001Z" fill="#9B9696"/>
                                                </svg>
                                                </button> {value?.machinery_info?.name}</td>
                                                <td>{value?.machinery_info?.norm_specification?.map((subValue, index) => (
                                                    <span key={index}>
                                                        {subValue?.name}{index < value?.machinery_info?.norm_specification - 1 && ','}
                                                        </span>
                                                ))}</td>
                                            </tr>
                                        ))}
                  </tbody>
                </table>
              </div>
            </div>}

            {/* Report Applied */}

            {parseInt(page) === 2 && <div>
              <div className="report_appliedBox">
                <h4 className="reportNormativa">Normativa Tecnica Applicata</h4>

                <div className="report_appliedDesc">
                  <p>
                    Nel presente capitolo vengono elencati tutti gli aspetti
                    difformi evidenziati durante l'analisi, e per ognuno di essi
                    viene proposta una soluzione tecnica, al fine di renderli
                    rispondenti ai requisiti di sicurezza applicabili secondo
                    legge.
                  </p>
                  <p>
                    Essi sono suddivisi, se del caso, nelle varie sub-aree di
                    cui si compone la macchina, e per tipologia di adeguamento:
                  </p>
                  <p>
                    A. Meccanico/Segnalazioni/Etichette: racchiude gli
                    adeguamenti che richiedono implementazioni di tipo meccanico
                    (quali ad esempio cartellature, o l'applicazione di
                    pittogrammi, segnalazioni di pericoli, targhettature varie
                  </p>
                  <p>
                    B. Elettrico/Sistemi di comando: in esso vengono riportati
                    tutte quelle implementazioni che coinvolgono l'introduzione
                    di nuove funzioni di sicurezza strumentate, o l'adeguamento
                    di quelle esistenti, o ancora l'adeguamento della pura parte
                    elettrica di una attrezzatura
                  </p>
                  <p>
                    Infine, è presente apposito campo, identificato come "STATUS
                    CONFORMITÀ", il quale indica, a seguito di adeguamento
                    eseguito e collaudo effettuato, quale sia l'avanzamento
                    della situazione di tale aspetto:
                  </p>
                  <ul className="report_appliedUl">
                    <li>
                      * Colore ROSSO: aspetto ancora da eseguire, e mancanze
                      importanti
                    </li>
                    <li>
                      * Colore GIALLO: aspetto in parte eseguito, e mancanze
                      limitate
                    </li>
                    <li>
                      * Colore VERDE: aspetto completamente eseguito ed aspetto
                      CONFORME
                    </li>
                  </ul>
                  <p>
                    Eventuali note e commenti relativi allo status d’avanzamento
                    dell'adeguamento proposto, sono riportati con relativa data
                    crescente, in fondo ad ogni tabella di adeguamento.
                  </p>
                </div>

                <div className="table-responsive tableFont24">
                  <table className="table mb-0">
                    <thead className="thbold">
                      <tr>
                        <th scope="col">Codice Norma</th>
                        <th scope="col">Descrizione Norma</th>
                        <th scope="col">Tipologia (secondo DM 2006/42/CE)</th>
                      </tr>
                    </thead>

                    {inspectionData?.data?.inspections?.map((value, index) =>(
                                                <tbody key={index}>
                                                    {value?.machinery_info?.norm_specification?.map((subValue,index2) =>(
                                                        <tr key={index2}>
                                                            <td> <button
                                                            className="switchEquipment">
                                                            <svg width="9"
                                                                height="14"
                                                                viewBox="0 0 9 14"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M3.33792 1.74699C3.33792 2.00663 3.26093 2.26045 3.1167 2.47635C2.97247 2.69225 2.76747 2.86054 2.52761 2.95995C2.28775 3.05936 2.0238 3.08542 1.76913 3.03483C1.51446 2.98425 1.2805 2.8593 1.09684 2.67578C0.913171 2.49225 0.788041 2.25839 0.737266 2.00376C0.68649 1.74913 0.712349 1.48516 0.811574 1.24522C0.910799 1.00528 1.07893 0.800152 1.29472 0.655757C1.51051 0.511363 1.76427 0.434189 2.02391 0.433991C2.19642 0.433859 2.36727 0.467724 2.52668 0.53365C2.6861 0.599575 2.83096 0.69627 2.95299 0.818206C3.07502 0.940143 3.17183 1.08493 3.23787 1.2443C3.30392 1.40366 3.33792 1.57448 3.33792 1.74699Z"
                                                                    fill="#9B9696" />
                                                                <path
                                                                    d="M3.33792 12.253C3.33792 12.5126 3.26093 12.7665 3.1167 12.9824C2.97247 13.1983 2.76747 13.3666 2.52761 13.466C2.28775 13.5654 2.0238 13.5914 1.76913 13.5408C1.51446 13.4903 1.2805 13.3653 1.09684 13.1818C0.913171 12.9983 0.788041 12.7644 0.737266 12.5098C0.68649 12.2551 0.712349 11.9912 0.811574 11.7512C0.910799 11.5113 1.07893 11.3062 1.29472 11.1618C1.51051 11.0174 1.76427 10.9402 2.02391 10.94C2.19642 10.9399 2.36727 10.9737 2.52668 11.0397C2.6861 11.1056 2.83096 11.2023 2.95299 11.3242C3.07502 11.4462 3.17183 11.5909 3.23787 11.7503C3.30392 11.9097 3.33792 12.0805 3.33792 12.253Z"
                                                                    fill="#9B9696" />
                                                                <path
                                                                    d="M8.59231 1.74699C8.59231 2.00663 8.51533 2.26045 8.3711 2.47635C8.22687 2.69225 8.02186 2.86054 7.782 2.95995C7.54214 3.05936 7.27819 3.08542 7.02352 3.03483C6.76885 2.98425 6.5349 2.8593 6.35123 2.67578C6.16756 2.49225 6.04244 2.25839 5.99166 2.00376C5.94088 1.74913 5.96674 1.48516 6.06597 1.24522C6.16519 1.00528 6.33333 0.800152 6.54912 0.655757C6.76491 0.511363 7.01866 0.434189 7.27831 0.433991C7.45082 0.433859 7.62166 0.467724 7.78108 0.53365C7.9405 0.599575 8.08536 0.69627 8.20739 0.818206C8.32941 0.940143 8.42622 1.08493 8.49227 1.2443C8.55831 1.40366 8.59231 1.57448 8.59231 1.74699Z"
                                                                    fill="#9B9696" />
                                                                <path
                                                                    d="M8.59231 12.253C8.59231 12.5126 8.51533 12.7665 8.3711 12.9824C8.22687 13.1983 8.02186 13.3666 7.782 13.466C7.54214 13.5654 7.27819 13.5914 7.02352 13.5408C6.76885 13.4903 6.5349 13.3653 6.35123 13.1818C6.16756 12.9983 6.04244 12.7644 5.99166 12.5098C5.94088 12.2551 5.96674 11.9912 6.06597 11.7512C6.16519 11.5113 6.33333 11.3062 6.54912 11.1618C6.76491 11.0174 7.01866 10.9402 7.27831 10.94C7.45082 10.9399 7.62166 10.9737 7.78108 11.0397C7.9405 11.1056 8.08536 11.2023 8.20739 11.3242C8.32941 11.4462 8.42622 11.5909 8.49227 11.7503C8.55831 11.9097 8.59231 12.0805 8.59231 12.253Z"
                                                                    fill="#9B9696" />
                                                                <path
                                                                    d="M8.59231 7.00001C8.59231 7.25966 8.51533 7.51347 8.3711 7.72937C8.22687 7.94527 8.02186 8.11356 7.782 8.21297C7.54214 8.31238 7.27819 8.33844 7.02352 8.28786C6.76885 8.23727 6.5349 8.11232 6.35123 7.9288C6.16756 7.74527 6.04244 7.51141 5.99166 7.25678C5.94088 7.00215 5.96674 6.73818 6.06597 6.49824C6.16519 6.25831 6.33333 6.05317 6.54912 5.90878C6.76491 5.76438 7.01866 5.68721 7.27831 5.68701C7.45082 5.68688 7.62166 5.72075 7.78108 5.78667C7.9405 5.8526 8.08536 5.94929 8.20739 6.07123C8.32941 6.19316 8.42622 6.33795 8.49227 6.49732C8.55831 6.65668 8.59231 6.8275 8.59231 7.00001Z"
                                                                    fill="#9B9696" />
                                                                <path
                                                                    d="M3.33792 7.00001C3.33792 7.25966 3.26093 7.51347 3.1167 7.72937C2.97247 7.94527 2.76747 8.11356 2.52761 8.21297C2.28775 8.31238 2.0238 8.33844 1.76913 8.28786C1.51446 8.23727 1.2805 8.11232 1.09684 7.9288C0.913171 7.74527 0.788041 7.51141 0.737266 7.25678C0.68649 7.00215 0.712349 6.73818 0.811574 6.49824C0.910799 6.25831 1.07893 6.05317 1.29472 5.90878C1.51051 5.76438 1.76427 5.68721 2.02391 5.68701C2.19642 5.68688 2.36727 5.72075 2.52668 5.78667C2.6861 5.8526 2.83096 5.94929 2.95299 6.07123C3.07502 6.19316 3.17183 6.33795 3.23787 6.49732C3.30392 6.65668 3.33792 6.8275 3.33792 7.00001Z"
                                                                    fill="#9B9696" />
                                                            </svg>
                                                        </button> {subValue?.name} 
                                                        </td>
                                                            <td>{subValue?.description}</td>
                                                            <td>{value?.machinery_info?.typology}</td>
                                                        </tr>
                                                        
                                                    ))}
                                            </tbody>
                                            ))} 

                    {/* </tbody> */}
                  </table>
                </div>
              </div>
            </div>}

            {parseInt(page) === 3 && <div>
                <ReportDocs id ={id_order} areas={areadata} />
              </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDocs = ({id, areas}) =>{
  const [currentPage, setCurrentPage] = useState(1);
  const {data:reports, isLoading, refetch} = useGetRevisionReportsQuery({
    id: id,
    params:{
      page: currentPage
    }
  });
  const [loading, setLoading] =useState(false);
  const [generateReports] = useGenerateReportsMutation()
  const [deleteReport] = useDeleteReportMutation();

  // generate Reports
  const generateReport = async() => {
    setLoading(true)
      await generateReports(id).unwrap().then((res) =>{
        if(res.status === "SUCCESS"){
          toast.success(res?.message)
          setLoading(false)
          refetch();
        }else{
          setLoading(false)
          toast.error(res?.message);
        }
      }).catch((err) => {
        setLoading(false)
        toast.error("Something went wrong");
        console.log(err)})
  }

  const findAreaByKeyPrefix = (prefix, extraProps = {}) => {
    const area = areas?.find(area => area?.key && area?.key.startsWith(prefix));
    if (area) {
        const deepCloneChildren = (children, extraProps) => {
            return React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    const clonedChild = React.cloneElement(child, { ...extraProps });

                    if (child.props && child.props.children) {
                        const updatedChildren = deepCloneChildren(child.props.children, extraProps);
                        return React.cloneElement(clonedChild, { children: updatedChildren });
                    }

                    return clonedChild;
                }
                return child;
            });
        };

        const clonedArea = React.cloneElement(area, {
            ...extraProps,
            children: deepCloneChildren(area.props.children, extraProps),
        });
        return clonedArea;
    }

    return null;
};

const handlePageClick = ({ selected }) => {
  setCurrentPage(selected + 1)
};

let perPageItem = reports?.pagination?.per_page;

const totalDocuments = reports?.pagination?.total_items;

const handleDeleteReport = async(id) =>{
  const result = await Swal.fire({
    title: "Sei sicuro?",
    text: "Non potrai più tornare indietro!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sì, cancellalo!",
    cancelButtonText: "Cancellare",
  });

if (result.isConfirmed) {
    await deleteReport(id).unwrap().then((res) =>{
        if(res?.status === "SUCCESS"){
          toast.success(res?.message)
            refetch()
        }
    }).catch((err) => {
        toast.error("Something went wrong");
        console.error(err);
    
    })
}
}

if(loading) return <Loader />

  return (
    <div>
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div className="cards-block Ispezioni-block">
              <div className="card-header border-0 pb-0 add-form-header">
                <div className="card-title">
                  <span className="title-icon">
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.351 35.676C4.64821 35.676 3.95231 35.5376 3.30303 35.2686C2.65375 34.9996 2.06382 34.6054 1.56692 34.1084C1.07002 33.6114 0.675888 33.0214 0.407034 32.372C0.138179 31.7227 -0.000131244 31.0268 9.34492e-08 30.324V5.351C9.34492e-08 3.93183 0.563765 2.57078 1.56727 1.56727C2.57078 0.563765 3.93183 0 5.351 0H19.928C21.3467 0.000651462 22.707 0.564649 23.71 1.568L30.542 8.4C31.5449 9.40354 32.1081 10.7643 32.108 12.183V30.324C32.108 31.7432 31.5442 33.1042 30.5407 34.1077C29.5372 35.1112 28.1762 35.675 26.757 35.675L5.351 35.676ZM3.568 30.324C3.568 30.7971 3.75596 31.2509 4.09052 31.5855C4.42509 31.92 4.87885 32.108 5.352 32.108H26.757C27.2301 32.108 27.6839 31.92 28.0185 31.5855C28.353 31.2509 28.541 30.7971 28.541 30.324V14.27H23.189C21.7698 14.27 20.4088 13.7062 19.4053 12.7027C18.4018 11.6992 17.838 10.3382 17.838 8.919V3.568H5.351C4.8782 3.56826 4.42484 3.7562 4.09052 4.09052C3.7562 4.42484 3.56826 4.8782 3.568 5.351V30.324ZM23.189 10.7H27.8L21.4 4.3V8.913C21.3996 9.14795 21.4456 9.38067 21.5354 9.59779C21.6252 9.8149 21.757 10.0121 21.9232 10.1782C22.0895 10.3442 22.2868 10.4758 22.5041 10.5654C22.7213 10.6549 22.954 10.7007 23.189 10.7ZM23.189 19.619C23.189 19.1459 23.001 18.6921 22.6665 18.3575C22.3319 18.023 21.8781 17.835 21.405 17.835C20.9319 17.835 20.4781 18.023 20.1435 18.3575C19.809 18.6921 19.621 19.1459 19.621 19.619V26.754C19.621 27.2271 19.809 27.6809 20.1435 28.0155C20.4781 28.35 20.9319 28.538 21.405 28.538C21.8781 28.538 22.3319 28.35 22.6665 28.0155C23.001 27.6809 23.189 27.2271 23.189 26.754V19.619ZM17.838 23.187C17.838 22.7139 17.65 22.2601 17.3155 21.9255C16.9809 21.591 16.5271 21.403 16.054 21.403C15.5809 21.403 15.1271 21.591 14.7925 21.9255C14.458 22.2601 14.27 22.7139 14.27 23.187V26.755C14.27 27.2281 14.458 27.6819 14.7925 28.0165C15.1271 28.351 15.5809 28.539 16.054 28.539C16.5271 28.539 16.9809 28.351 17.3155 28.0165C17.65 27.6819 17.838 27.2281 17.838 26.755V23.187ZM10.7 24.973C10.2269 24.973 9.77309 25.161 9.43852 25.4955C9.10396 25.8301 8.916 26.2839 8.916 26.757C8.916 27.2301 9.10396 27.6839 9.43852 28.0185C9.77309 28.353 10.2269 28.541 10.7 28.541H10.718C11.1911 28.541 11.6449 28.353 11.9795 28.0185C12.314 27.6839 12.502 27.2301 12.502 26.757C12.502 26.2839 12.314 25.8301 11.9795 25.4955C11.6449 25.161 11.1911 24.973 10.718 24.973H10.7Z"
                        fill="#ECAD42"
                      />
                    </svg>
                  </span>
                  <span>Reports</span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={generateReport}
                    className="btn btn-primary text-center"
                  >
                    Genera report
                  </button>
                </div>
              </div>
              <div className="card-block-body card-icons">
                <div className="table-responsive">
                  <table className="table m b-0">
                    <thead className="thbold">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Report Nome</th>
                        <th scope="col">Data Ispezione</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports?.data?.map((item, index) => (
                        <tr>
                          {/* <td>{index + 1}</td> */}
                          <td>{(currentPage - 1) * perPageItem + index + 1}</td>
                          <td>{item?.report_name.replace(".pdf", "")}</td>
                          <td>{moment(item?.time).format("DD-MM-YYYY")}</td>
                          <td className="table_action_list">
                            <a
                              className="table_actionBtn"
                              href={item?.report_full_url}
                              download={`${item?.report_name}${moment(
                                item?.time
                              ).format("DD-MM-YYYY")}`}
                            >
                              <span>
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 26 26"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  stroke="#f8ba35"
                                >
                                  <g
                                    id="SVGRepo_bgCarrier"
                                    strokeWidth="0"
                                  ></g>
                                  <g
                                    id="SVGRepo_tracerCarrier"
                                    strokeLinecap="round"
                                    stroke-linejoin="round"
                                  ></g>
                                  <g id="SVGRepo_iconCarrier">
                                    {" "}
                                    <path
                                      d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                                      stroke="#f8ba35"
                                      strokeWidth="1.9200000000000004"
                                      strokeLinecap="round"
                                      stroke-linejoin="round"
                                    ></path>{" "}
                                    <path
                                      d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
                                      stroke="#f8ba35"
                                      strokeWidth="1.9200000000000004"
                                      strokeLinecap="round"
                                      stroke-linejoin="round"
                                    ></path>{" "}
                                  </g>
                                </svg>
                              </span>
                            </a>

                            <a
                              className="table_actionBtn"
                              onClick={() =>
                                handleDeleteReport(item?.id_report)
                              }
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 26 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                                  stroke="currentcolor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  stroke-linejoin="round"
                                ></path>
                              </svg>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {reports?.data?.length === 0 ? (
                    <h4
                      className="text-center my-4"
                      style={{ color: "#ecad42" }}
                    >
                      Nessun record trovato
                    </h4>
                  ) : null}
                </div>

                {/* pagination */}
                {totalDocuments > perPageItem && (
                  <div>
                    {findAreaByKeyPrefix("PaginationArea", {
                      totalDocuments: totalDocuments,
                      currentPage: currentPage,
                      perPageItem: perPageItem,
                      handlePageClick,
                    }) || <div>- -</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportComponentElement;
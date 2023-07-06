"use client";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ExistingFileForm from "@/components/existingFileForm";
import AddInitialForm from "@/components/addInitialForm";
export default function Home() {
  const [toRole, setToRole] = useState({
    label: "first level",
    value: "first level",
  });
  const [individualCom, setIndividualCom] = useState("");
  const [eFilerData, setEFilerData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  useEffect(() => {
    setLoader(true);
    axios
      .get("http://localhost:9000/api/fileStatus")
      .then((res) => {
        console.log(res.data);
        setEFilerData(res.data.fileStatus);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  }, [refreshFlag]);
  const refresh = () => {
    setRefreshFlag(!refreshFlag);
  };
  return loader ? (
    <main className={styles.main}>
      <h1>Loading....</h1>
    </main>
  ) : (
    <main className={styles.main}>
      {Object.keys(eFilerData).length > 0 ? (
        <ExistingFileForm
          currentRole={eFilerData.nextRole}
          wholeFiler={eFilerData}
          refresh={refresh}
        />
      ) : (
        <AddInitialForm refresh={refresh} />
      )}
    </main>
  );
}

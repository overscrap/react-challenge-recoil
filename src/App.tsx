import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import {
  wannaGoState,
  haveBeenState,
  favsState,
  ICountry,
  Keys
} from "./atoms";
import { useEffect } from "react";
import { Wrapper, Container,Countries, Country, Error} from "./Style";
 
interface IForm {
  name: string;
}

export default function App() {
  const { register, handleSubmit, formState, setValue } = useForm<IForm>({
    mode: "onSubmit"
  });

  const [wannaGo, setWannaGo] = useRecoilState(wannaGoState);
  const [haveBeen, setHaveBeen] = useRecoilState(haveBeenState);
  const [favs, setFavs] = useRecoilState(favsState);

  const onValid = ({ name }: IForm) => {
    setWannaGo((current) => [...current, { name, id: Date.now() }]);
    setValue("name", "");
  };

  useEffect(() => {
    localStorage.setItem(Keys.WANNA_GO, JSON.stringify(wannaGo));
    localStorage.setItem(Keys.HAVE_BEEN, JSON.stringify(haveBeen));
    localStorage.setItem(Keys.FAVS, JSON.stringify(favs));
  }, [wannaGo, haveBeen, favs]);

  const getCountry = (id: number, arr: ICountry[]) =>
    arr.find((country) => country.id === id);
  const deleteCountry = (id: number, arr: ICountry[]) =>
    arr.filter((country) => country.id !== id);
  const addCountry = (country: ICountry, arr: ICountry[]) => [...arr, country];

  const onCheckedClick = (id: number) => {
    const country = getCountry(id, wannaGo);
    if (!country) return;
    setWannaGo((current) => deleteCountry(id, current));
    setHaveBeen((current) => addCountry(country, current));
  };

  const onLikedClick = (id: number) => {
    const country = getCountry(id, haveBeen);
    if (!country) return;
    setHaveBeen((current) => deleteCountry(id, current));
    setFavs((current) => addCountry(country, current));
  };

  const onDislikeClick = (id: number) => {
    const country = getCountry(id, favs);
    if (!country) return;
    setFavs((current) => deleteCountry(id, current));
    setHaveBeen((current) => addCountry(country, current));
  };

  const onCancelClick = (id: number) => {
    const country = getCountry(id, haveBeen);
    if (!country) return;
    setHaveBeen((current) => deleteCountry(id, current));
    setWannaGo((current) => addCountry(country, current));
  };

  const onTrashClick = (id: number) => {
    const country = getCountry(id, wannaGo);
    if (!country) return;
    setWannaGo((current) => deleteCountry(id, current));
  };

  return (
    <Wrapper>
      <Container>
        <h2>내가 가고싶은 나라들</h2>
        <form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("name", {
              required: "😠 required!"
            })}
            placeholder="이름"
            type="text"
          />
          <Error>{formState.errors.name?.message}</Error>
          <input type="submit" value="가자!️" />
        </form>
        <Countries>
          {wannaGo.map((country) => (
            <Country key={country.id}>
              <span>{country.name}</span>
              <button onClick={() => onCheckedClick(country.id)}>✅</button>
              <button onClick={() => onTrashClick(country.id)}>🗑️</button>
            </Country>
          ))}
        </Countries>
      </Container>
      <Container>
        <h2>내가 가본 나라들</h2>
        <Countries>
          {haveBeen.map((country) => (
            <Country key={country.id}>
              <span>{country.name}</span>
              <button onClick={() => onLikedClick(country.id)}>👍🏻</button>
              <button onClick={() => onCancelClick(country.id)}>❌</button>
            </Country>
          ))}
        </Countries>
      </Container>
      <Container>
        <h2>내가 좋아하는 나라들</h2>
        <Countries>
          {favs.map((country) => (
            <Country key={country.id}>
              <span>{country.name}</span>
              <button onClick={() => onDislikeClick(country.id)}>👎🏻</button>
            </Country>
          ))}
        </Countries>
      </Container>
    </Wrapper>
  );
}

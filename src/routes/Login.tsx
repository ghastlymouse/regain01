import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/AuthComponents";
import GithubButton from "../components/GithubButton";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email.trim() === "" || password.trim() === "") return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
    console.log(name, email, password);
  };

  const resetPassword = async (email: string) => {
    if (!email.trim()) {
      return alert("Please enter the e-mail");
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email has been sent, please check your email.");
    } catch (error) {}
  };

  return (
    <Wrapper>
      <Title>Log into Nwitter</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error != "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an accout?{" "}
        <Link to={"/create-account"}>Create one &rarr;</Link>
      </Switcher>
      <Switcher>
        Forget your password?{" "}
        <button type="button" onClick={() => resetPassword(email)}>
          Reset Password &rarr;
        </button>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}

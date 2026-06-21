// ============================================
// LineSight — API Documentation Data
// All function docs sourced from actual implementation
// ============================================

const DOCS_DATA = {

  // ═══════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════
  categories: [
    {
      id: "core",
      name: "Core Operations",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>`,
      description: "Foundational scikit-learn-compatible methods shared across every model — covering training, inference, evaluation, and persistence.",
      functions: ["fit", "predict", "score", "get_training_history", "summary", "refit", "show", "save"]
    },
    {
      id: "explain",
      name: "Textual Explanations",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
      description: "Natural-language interpretation of model parameters, providing human-readable coefficient analysis and fit quality assessments.",
      functions: ["show_equation", "explain_coefficients", "explain_fit"]
    },
    {
      id: "visualization",
      name: "Visualizations",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="9 17 9 12 13 12 13 8"/></svg>`,
      description: "Publication-quality matplotlib charts, 3D surfaces, and animated training sequences for model diagnostics and presentation.",
      functions: ["plot_fit", "plot_residuals", "plot_loss_curve", "animate_training", "plot_loss_surface", "compare_learning_rates", "plot_actual_vs_predicted", "plot_learning_curve", "plot_gradient_vectors", "plot_prediction_intervals", "animate_loss_surface_path", "plot_sensitivity_analysis"]
    }
  ],

  // ═══════════════════════════════════════════════
  // FUNCTION DOCS
  // ═══════════════════════════════════════════════
  functions: {

    // ─────────────────────────────────────────────
    // fit()
    // ─────────────────────────────────────────────
    fit: {
      name: "fit",
      signature: "model.fit(X, y)",
      category: "core",
      models: ["All Models"],
      source: "regression/linear/engine/fit.py",
      shortDesc: "Optimize model parameters on the provided dataset using the configured optimization algorithm.",
      longDesc: `Executes the underlying optimization engine (Gradient Descent or Coordinate Descent) to compute optimal weights and bias for the given dataset. For LinearRegression, this minimizes Mean Squared Error to determine the slope \`m\` and intercept \`b\`.

The training loop iterates for \`self.epochs\` steps. At each epoch:
1. Partial derivatives \`\u2202J/\u2202m\` and \`\u2202J/\u2202b\` are computed
2. Parameters are updated via the gradient step: \`m \u2190 m - lr \u00d7 \u2202J/\u2202m\`, \`b \u2190 b - lr \u00d7 \u2202J/\u2202b\`
3. The current MSE loss is evaluated
4. If \`store_history=True\`, per-epoch snapshots of loss, weights, biases, and gradients are recorded

Prior to training, all hyperparameters undergo validation (\`learning_rate > 0\`, \`epochs > 0\`, etc.) and input data is checked for NaN values, infinite values, shape mismatches, and zero-variance features.

Upon completion, a convergence diagnostic is performed: if the loss was still decreasing at the final epoch, a \`LineSightConvergenceWarning\` is issued recommending additional epochs.

**When to use**: This is the first method to call after instantiating a model. All subsequent operations (\`predict\`, \`score\`, \`plot_fit\`, etc.) require the model to be fitted. Conceptually, \`fit()\` is the learning phase \u2014 the model examines your data and discovers the underlying relationship.

**Error handling**: If the input data contains NaN or Inf values, \`fit()\` raises a \`LineSightShapeError\` immediately rather than producing invalid results. If the learning rate is disproportionately large for the data scale, gradient explosion is detected and a \`LineSightGradientError\` is raised with an actionable suggestion to reduce the learning rate.

**Computational complexity**: For small to medium datasets (< 100,000 samples), training completes in under a second. Per-epoch cost is O(n) where n is the number of samples.`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n_samples,) or (n_samples, 1)",
          default: null,
          required: true,
          desc: "Feature matrix. Accepts NumPy arrays, Python lists, or Pandas DataFrames/Series. 1-D arrays are automatically reshaped to (n, 1). If a DataFrame is passed, column names are preserved in `self.feature_names_in_`."
        },
        {
          name: "y",
          type: "array-like, shape (n_samples,)",
          default: null,
          required: true,
          desc: "Target vector. Accepts NumPy arrays, Python lists, or Pandas Series. Multi-dimensional y is flattened to 1-D."
        }
      ],

      returns: {
        type: "self",
        desc: "Returns the trained model object, enabling method chaining: `model.fit(X, y).predict(X_test)`"
      },

      raises: [
        {
          exception: "ValueError",
          condition: "`learning_rate <= 0` or `epochs <= 0` or `alpha < 0`",
          message: "\"learning_rate must be > 0\""
        },
        {
          exception: "LineSightShapeError",
          condition: "X is a scalar, X has 0 samples, X or y contain NaN or Inf values, or X and y have different row counts",
          message: "\"X contains NaN values. Clean your data before training.\" or \"X has {n} rows, y has {m} elements.\""
        },
        {
          exception: "LineSightGradientError",
          condition: "Loss becomes NaN or infinity during training (gradient explosion)",
          message: "\"Training failed: gradients exploded to infinity at epoch {n}. This usually happens when the learning rate is too high for the scale of your data. Try reducing 'learning_rate' (e.g., from {lr} to {lr/10}) or try normalizing your features.\""
        }
      ],

      warns: [
        {
          warning: "LineSightConvergenceWarning",
          condition: "Loss was still decreasing at the final epoch",
          message: "\"Model hasn't fully converged. Loss was still decreasing at epoch {n}. Try increasing 'epochs' or using a larger 'learning_rate'.\""
        },
        {
          warning: "LineSightDataWarning",
          condition: "One or more features have zero variance (constant values)",
          message: "\"Feature(s) at column index [i] have zero variance (constant values). These carry no information.\""
        }
      ],

      internalSteps: [
        "Validate hyperparameters via `_validate_hyperparams()`",
        "Extract feature names from DataFrame columns (if applicable)",
        "Validate X and y shapes, types, NaN/Inf via `_validate_Xy()`",
        "Initialize slope `m = 0.0` and intercept `b = 0.0`",
        "Run gradient descent for `self.epochs` iterations",
        "At each epoch: compute gradient → update params → compute loss",
        "Check for gradient explosion (NaN/Inf loss) — raises LineSightGradientError",
        "Store history if `store_history=True` (losses, weights, biases, gradients)",
        "Check convergence: warn if loss was still decreasing at final epoch",
        "Store TrainingHistory dataclass and set `_is_fitted = True`"
      ],

      mathFormula: `Loss J = (1/n) × Σ(y_pred - y)²
     = (1/n) × Σ(m·x + b - y)²

∂J/∂m = (2/n) × Σ((m·x + b - y) · x)
∂J/∂b = (2/n) × Σ(m·x + b - y)

Update rule:
  m := m - learning_rate × ∂J/∂m
  b := b - learning_rate × ∂J/∂b`,

      example: `import numpy as np
from linesight import LinearRegression

# Generate sample data
X = np.linspace(0, 10, 100).reshape(-1, 1)
y = 2.5 * X.ravel() + 1.0 + np.random.randn(100) * 0.5

# Train the model
model = LinearRegression(
    learning_rate=0.01,
    epochs=1000,
    store_history=True
)
model.fit(X, y)

print(f"Slope: {model.m:.4f}")      # ≈ 2.5
print(f"Intercept: {model.b:.4f}")   # ≈ 1.0`,

      inputExample: `import numpy as np
from linesight import LinearRegression

# Input data: 5 data points
X = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
y = np.array([2.1, 4.0, 5.8, 8.1, 9.9])

# Model configuration
model = LinearRegression(
    learning_rate=0.01,
    epochs=1000,
    store_history=True
)

# Train the model
model.fit(X, y)`,

      outputExample: `# After calling model.fit(X, y):

model.m              → 1.9800    # learned slope
model.b              → 0.1200    # learned intercept
model._is_fitted     → True
model.coef_          → 1.9800
model.intercept_     → 0.1200

# Training history (store_history=True):
len(history.losses)  → 1000      # one loss per epoch
history.losses[0]    → 29.6040   # initial loss (high)
history.losses[-1]   → 0.0148    # final loss (low)
history.converged    → True      # model converged`,

      seeAlso: ["predict", "score", "refit", "get_training_history"]
    },

    // ─────────────────────────────────────────────
    // predict()
    // ─────────────────────────────────────────────
    predict: {
      name: "predict",
      signature: "model.predict(X)",
      category: "core",
      models: ["All Models"],
      source: "regression/linear/engine/predict.py",
      shortDesc: "Compute predicted target values for the given feature matrix using learned model parameters.",
      longDesc: `Applies the learned parameters \`m\` (slope) and \`b\` (intercept) to compute predictions via the equation \`\u0177 = m\u00b7x + b\`. The model must have been fitted prior to calling this method.

Input validation ensures the feature dimensionality matches the training data. For example, if the model was trained on 1 feature but receives 3 features at prediction time, a \`LineSightShapeError\` is raised with a clear diagnostic message.

For LogisticRegression, this method returns binary class labels (0 or 1) rather than continuous values, after applying the sigmoid function and a 0.5 decision threshold.

**When to use**: After calling \`fit()\`, use \`predict()\` to generate predictions on new, unseen data. This is the inference step \u2014 the model applies the relationships learned during training to produce estimates for data it has not encountered before.

**Implementation detail**: The computation is a fully vectorized NumPy operation: \`y_hat = m * X.ravel() + b\`. For n samples, this executes as a single multiplication and addition (O(n) time). No gradients are computed, making prediction nearly instantaneous regardless of dataset size.

**Error handling**: Providing data with a different feature count than the training data raises a descriptive error. NaN or Inf values in X are also caught before any computation occurs.`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n_samples,) or (n_samples, 1)",
          default: null,
          required: true,
          desc: "Feature matrix for prediction. Must have the same number of features as the training data. 1-D arrays are reshaped to (n, 1)."
        }
      ],

      returns: {
        type: "np.ndarray, shape (n_samples,)",
        desc: "Predicted y values. For regression: continuous values. For LogisticRegression: binary labels (0 or 1)."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "`fit()` has not been called yet",
          message: "\"Call fit(X, y) before calling predict().\""
        },
        {
          exception: "LineSightShapeError",
          condition: "X has a different number of features than training data",
          message: "\"Model trained on {n} feature(s), but X has {m} feature(s).\""
        },
        {
          exception: "LineSightShapeError",
          condition: "X contains NaN or Inf values",
          message: "\"X contains NaN values. Clean your data before training.\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check that model is fitted via `_check_fitted('predict')`",
        "Validate X shape and feature count via `_validate_X()`",
        "Compute `y_hat = m * X.ravel() + b`",
        "Return the predictions array"
      ],

      mathFormula: `ŷ = m · x + b

where:
  m = learned slope (coef_)
  b = learned intercept (intercept_)
  x = input feature values`,

      example: `# After fitting
y_pred = model.predict(X)
print(y_pred[:5])  # First 5 predictions

# Predict on new data
X_new = np.array([[5.0], [7.5], [10.0]])
predictions = model.predict(X_new)
print(predictions)  # [≈13.5, ≈19.75, ≈26.0]`,

      inputExample: `# Model already fitted with slope ≈ 2.5, intercept ≈ 1.0
# Predict on 3 new data points:

X_new = np.array([[2.0], [5.0], [8.0]])
y_pred = model.predict(X_new)`,

      outputExample: `# Return value: np.ndarray, shape (3,)

y_pred → array([6.0000, 13.5000, 21.0000])

# Breakdown:
#   x=2.0 → 2.5 × 2.0 + 1.0 = 6.0
#   x=5.0 → 2.5 × 5.0 + 1.0 = 13.5
#   x=8.0 → 2.5 × 8.0 + 1.0 = 21.0

type(y_pred) → numpy.ndarray
y_pred.shape → (3,)`,

      seeAlso: ["fit", "score"]
    },

    // ─────────────────────────────────────────────
    // score()
    // ─────────────────────────────────────────────
    score: {
      name: "score",
      signature: "model.score(X, y)",
      category: "core",
      models: ["All Regression Models"],
      source: "regression/linear/engine/score.py",
      shortDesc: "Evaluate model performance by computing a comprehensive suite of regression or classification metrics.",
      longDesc: `Evaluates model predictions against ground-truth values and returns a dictionary of standard performance metrics, rounded to 6 decimal places for readability.

For regression models, the returned metrics include MSE, RMSE, MAE, and R\u00b2. For classification models (LogisticRegression), the method returns accuracy, precision, recall, and F1 score instead.

Internally, the method calls \`predict(X)\` and compares the result against the true \`y\` values using the metric functions from \`linesight.metrics\`.

**When to use**: Call \`score()\` after fitting to obtain a quantitative assessment of model quality. Apply it to training data to verify learning accuracy, and to held-out test data to evaluate generalization performance. The returned dictionary provides granular access to individual metrics by key.

**Interpreting the metrics**: R\u00b2 (coefficient of determination) is the most intuitive \u2014 it represents the proportion of variance in y explained by the model (1.0 = perfect, 0.0 = no better than predicting the mean). RMSE shares the same units as the target variable, making it directly interpretable. MAE provides a similar measure but is more robust to outliers. MSE is the raw objective function that gradient descent minimizes.

**Pedagogical design**: This method reinforces the principle that training a model is only half the workflow \u2014 rigorous evaluation is equally critical. By exposing multiple metrics simultaneously, students learn that model quality is a multi-dimensional assessment, not a single number.`,

      parameters: [
        {
          name: "X",
          type: "array-like",
          default: null,
          required: true,
          desc: "Feature matrix for evaluation."
        },
        {
          name: "y",
          type: "array-like",
          default: null,
          required: true,
          desc: "True target values to compare predictions against."
        }
      ],

      returns: {
        type: "dict",
        desc: `For regression:
{
    "mse":        float,   # Mean Squared Error
    "rmse":       float,   # Root Mean Squared Error
    "mae":        float,   # Mean Absolute Error
    "r2":         float,   # R-squared (coefficient of determination)
    "n_samples":  int,     # Number of data points
    "n_features": int      # Number of input features
}

For classification (LogisticRegression):
{
    "accuracy":   float,
    "precision":  float,
    "recall":     float,
    "f1":         float
}`
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model has not been fitted",
          message: "\"Call fit(X, y) before calling score().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check that model is fitted",
        "Validate X and y shapes",
        "Generate predictions via `self.predict(X)`",
        "Compute MSE = mean((y - ŷ)²)",
        "Compute RMSE = √MSE",
        "Compute MAE = mean(|y - ŷ|)",
        "Compute R² = 1 - SS_res / SS_tot",
        "Round all metrics to 6 decimal places",
        "Return dictionary with all metrics"
      ],

      mathFormula: `MSE  = (1/n) × Σ(yᵢ - ŷᵢ)²
RMSE = √MSE
MAE  = (1/n) × Σ|yᵢ - ŷᵢ|
R²   = 1 - Σ(yᵢ - ŷᵢ)² / Σ(yᵢ - ȳ)²

where ȳ = mean(y)`,

      example: `metrics = model.score(X, y)
print(metrics)
# {
#   'mse': 0.248311,
#   'rmse': 0.498308,
#   'mae': 0.398214,
#   'r2': 0.997012,
#   'n_samples': 100,
#   'n_features': 1
# }

# Access individual metrics
print(f"R² = {metrics['r2']}")  # 0.997012`,

      inputExample: `# Model already fitted on training data
# Evaluate on the same data (training score):

metrics = model.score(X, y)`,

      outputExample: `# Return value: dict

metrics → {
    'mse':        0.248311,   # Mean Squared Error
    'rmse':       0.498308,   # Root Mean Squared Error
    'mae':        0.398214,   # Mean Absolute Error
    'r2':         0.997012,   # R² (coefficient of determination)
    'n_samples':  100,        # number of data points
    'n_features': 1           # number of input features
}

# Quick interpretation:
#   R² = 0.997 → model explains 99.7% of variance
#   RMSE = 0.498 → predictions off by ±0.5 on average`,

      seeAlso: ["fit", "predict", "explain_fit"]
    },

    // ─────────────────────────────────────────────
    // get_training_history()
    // ─────────────────────────────────────────────
    get_training_history: {
      name: "get_training_history",
      signature: "model.get_training_history()",
      category: "core",
      models: ["All Models"],
      source: "regression/linear/engine/get_history.py",
      shortDesc: "Retrieve the per-epoch training history recorded during the most recent fit() call.",
      longDesc: `Returns a \`TrainingHistory\` dataclass containing per-epoch snapshots recorded during the most recent \`fit()\` call. This object serves as the foundation for visualizations such as \`plot_loss_curve()\` and \`animate_training()\`.

The TrainingHistory dataclass contains the following fields:
- \`losses\`: List of MSE values at each epoch
- \`weights\`: List of slope values at each epoch
- \`biases\`: List of intercept values at each epoch
- \`gradients\`: List of gradient arrays at each epoch
- \`learning_rate\`: The learning rate used during training
- \`epochs_run\`: Total number of epochs completed
- \`converged\`: Boolean indicating whether convergence criteria were met

If \`store_history=False\` was set during model instantiation, all lists will be empty and a diagnostic warning is issued.

**When to use**: Access this object when analyzing the training process itself \u2014 not just the final result. Useful for debugging convergence issues, illustrating how gradient descent evolves over time, and examining the trajectory of parameter updates.

**Pedagogical design**: This object reveals the complete trajectory of gradient descent, not merely the final outcome. By inspecting how the slope and intercept change at each step, the abstract mathematics of optimization becomes a concrete, observable process.`,

      parameters: [],

      returns: {
        type: "TrainingHistory",
        desc: "Dataclass with `losses`, `weights`, `biases`, `gradients` lists, plus `learning_rate`, `epochs_run`, and `converged` fields."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model has not been fitted",
          message: "\"Call fit(X, y) before calling get_training_history().\""
        }
      ],

      warns: [
        {
          warning: "LineSightDataWarning",
          condition: "`store_history=False` was used during model creation",
          message: "\"Training history is empty because store_history=False. Re-fit with store_history=True to access per-epoch data.\""
        }
      ],

      internalSteps: [
        "Check that model is fitted",
        "Check if history is empty (store_history=False) — warn if so",
        "Return the `_history` TrainingHistory dataclass"
      ],

      mathFormula: null,

      example: `model = LinearRegression(
    learning_rate=0.01,
    epochs=500,
    store_history=True   # ← Required!
)
model.fit(X, y)

history = model.get_training_history()
print(f"Final loss: {history.losses[-1]:.6f}")
print(f"Converged: {history.converged}")
print(f"Epochs run: {history.epochs_run}")

# Access per-epoch data
import matplotlib.pyplot as plt
plt.plot(history.losses)
plt.title("Loss over epochs")
plt.show()`,

      inputExample: `# Model fitted with store_history=True
history = model.get_training_history()`,

      outputExample: `# Return value: TrainingHistory dataclass

history.losses        → [29.604, 18.221, ..., 0.0148]  # 500 values
history.weights       → [0.0, 0.198, ..., 1.9800]      # slope per epoch
history.biases        → [0.0, 0.012, ..., 0.1200]      # intercept per epoch
history.gradients     → [array([-23.4, -8.1]), ...]     # gradient arrays
history.learning_rate → 0.01
history.epochs_run    → 500
history.converged     → True

# Useful for analysis:
history.losses[0]     → 29.604    # initial loss
history.losses[-1]    → 0.0148    # final loss
len(history.losses)   → 500       # one per epoch`,

      seeAlso: ["fit", "plot_loss_curve", "animate_training"]
    },

    // ─────────────────────────────────────────────
    // summary()
    // ─────────────────────────────────────────────
    summary: {
      name: "summary",
      signature: "model.summary()",
      category: "core",
      models: ["All Models"],
      source: "regression/linear/core.py",
      shortDesc: "Generate a formatted summary of the trained model, including configuration, convergence status, and key metrics.",
      longDesc: `Produces a structured text summary of the model containing training configuration, convergence diagnostics, and final loss. Each regression subclass overrides this method to include model-specific details.

In script mode (running from a .py file), the summary is printed to stdout. In Jupyter or Colab environments, it is returned as a string and displayed as the cell\'s output.

The summary includes:
- Model type (e.g., \"LinearRegression\")
- Learning rate and epoch count
- Convergence status (whether the loss stabilized)
- Final loss value

**When to use**: Call \`summary()\` as a post-training sanity check. It provides a concise overview of the entire training run in a single call. Particularly effective in Jupyter notebooks where the formatted output renders inline.

**Pedagogical design**: This method instills the practice of inspecting model state after training. Rather than calling \`fit()\` and proceeding blindly, \`summary()\` encourages reviewing hyperparameters, convergence behavior, and final loss before using the model for inference.`,

      parameters: [],

      returns: {
        type: "str",
        desc: "The formatted summary text. Also printed to stdout in script mode."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model has not been fitted",
          message: "\"Call fit(X, y) before calling summary().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check that model is fitted",
        "Read convergence status from training history",
        "Read final loss from history (or 'N/A' if history is empty)",
        "Format the summary string with model type, hyperparams, and metrics",
        "Detect environment — print to stdout in script mode",
        "Return the summary string"
      ],

      mathFormula: null,

      example: `model.fit(X, y)
model.summary()

# Output:
# ==================================================
# LineSight — LinearRegression
# ==================================================
# Training config:
#   Learning rate:  0.01
#   Epochs:         1000
#   Converged:      Yes
#   Final loss:     0.248311
# ==================================================`,

      inputExample: `# After fitting the model:
model.summary()`,

      outputExample: `# Printed to stdout (script mode) or returned as string (Jupyter):

==================================================
LineSight — LinearRegression
==================================================
Training config:
  Learning rate:  0.01
  Epochs:         1000
  Converged:      Yes
  Final loss:     0.248311
==================================================

# Return value: str (the same text shown above)`,

      seeAlso: ["explain_fit", "show_equation", "score"]
    },

    // ─────────────────────────────────────────────
    // refit()
    // ─────────────────────────────────────────────
    refit: {
      name: "refit",
      signature: "model.refit(X, y)",
      category: "core",
      models: ["All Models"],
      source: "base.py",
      shortDesc: "Reset all model state and retrain from scratch on new data.",
      longDesc: `Performs a complete state reset (coefficients, intercept, training history, fitted flag) followed by a fresh call to \`fit(X, y)\` with the new data.

This method exists because calling \`fit()\` twice on the same model object does NOT reset parameters \u2014 the second call continues from the previous state. This behavior can produce confusing results, especially for learners. \`refit()\` makes the intention explicit by guaranteeing a clean initialization.

Functionally equivalent to creating a new model instance with identical hyperparameters and calling \`fit()\`.

**When to use**: Use \`refit()\` when training on different data while preserving the same model configuration (learning rate, epochs, etc.). Common scenarios include cross-validation workflows, dataset comparison studies, or correcting data preparation errors.

**Design rationale**: In most ML frameworks, calling \`fit()\` twice accumulates state implicitly. LineSight makes this distinction explicit: \`fit()\` continues training, \`refit()\` starts fresh. This prevents a common mistake where users inadvertently continue training from a previous run.

**Error handling**: All validation rules from \`fit()\` apply. The state reset occurs BEFORE validation, so if the new data is invalid, the model is left in an un-fitted state (\`_is_fitted = False\`).`,

      parameters: [
        {
          name: "X",
          type: "array-like",
          default: null,
          required: true,
          desc: "New feature matrix to train on."
        },
        {
          name: "y",
          type: "array-like",
          default: null,
          required: true,
          desc: "New target vector to train on."
        }
      ],

      returns: {
        type: "self",
        desc: "Returns the re-trained model object."
      },

      raises: [
        {
          exception: "Same as fit()",
          condition: "All validation errors from fit() apply here too",
          message: "See fit() documentation for full error list"
        }
      ],

      warns: [],

      internalSteps: [
        "Reset `coef_` to 0.0 (if exists)",
        "Reset `intercept_` to 0.0 (if exists)",
        "Reset `theta_` to None (if exists)",
        "Set `_is_fitted = False`",
        "Create a fresh TrainingHistory object",
        "Call `self.fit(X, y)` with the new data"
      ],

      mathFormula: null,

      example: `# Initial training
model.fit(X_train, y_train)
print(f"Slope after first fit: {model.m:.4f}")

# DON'T do this — continues from previous state:
# model.fit(X_new, y_new)

# DO this — clean reset + retrain:
model.refit(X_new, y_new)
print(f"Slope after refit: {model.m:.4f}")`,

      inputExample: `# Original training:
model.fit(X_train, y_train)   # slope → 2.50

# New data arrives:
X_new = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
y_new = np.array([5.1, 7.0, 9.2, 11.0, 12.8])

# Retrain from scratch:
model.refit(X_new, y_new)`,

      outputExample: `# Before refit:
model.m → 2.5000    # slope from old data
model.b → 1.0000    # intercept from old data

# After refit:
model.m → 1.9500    # NEW slope from new data
model.b → 3.1200    # NEW intercept from new data
model._is_fitted → True

# All previous history is replaced:
len(history.losses) → 1000  # fresh history`,

      seeAlso: ["fit"]
    },

    // ─────────────────────────────────────────────
    // show()
    // ─────────────────────────────────────────────
    show: {
      name: "show",
      signature: "model.show(animation_obj=None, fig=None)",
      category: "core",
      models: ["All Models"],
      source: "base.py",
      shortDesc: "Render a matplotlib figure or animation using automatic environment detection.",
      longDesc: `Manages the complexity of rendering matplotlib figures and animations across heterogeneous Python environments (Jupyter, Google Colab, and script mode).

For STATIC figures:
- In Jupyter/Colab: \`plt.show()\` closes the figure and triggers the inline backend to render it
- In script mode: \`plt.show()\` opens an interactive window
- Returns \`None\` in both cases (the figure is consumed by the display)

For ANIMATIONS:
- In Jupyter/Colab: Returns \`HTML(anim.to_jshtml())\` for interactive playback with controls
- In script mode: \`plt.show()\` runs the animation in a window

Typically, this method is called internally by visualization methods (e.g., \`plot_fit()\`) when \`display=True\`.

**When to use**: Call \`show()\` directly only when building custom matplotlib figures that require LineSight's automatic environment detection. All built-in visualization methods already invoke \`show()\` internally.

**Environment detection**: LineSight checks for the \`IPython\` module and its \`get_ipython()\` function. If a Jupyter kernel is detected, HTML rendering is used for animations. In Google Colab, an equivalent path is followed. Otherwise, the standard \`plt.show()\` windowed display is used.`,

      parameters: [
        {
          name: "animation_obj",
          type: "FuncAnimation, optional",
          default: "None",
          required: false,
          desc: "A matplotlib FuncAnimation object to display."
        },
        {
          name: "fig",
          type: "matplotlib.figure.Figure, optional",
          default: "None",
          required: false,
          desc: "A matplotlib Figure object to display."
        }
      ],

      returns: {
        type: "HTML | None",
        desc: "Returns `HTML(anim.to_jshtml())` for animations in Jupyter. Returns `None` for everything else."
      },

      raises: [],
      warns: [],

      internalSteps: [
        "Detect environment via `_detect_environment()` → 'jupyter', 'colab', or 'script'",
        "If animation_obj is provided and env is Jupyter/Colab: close figure, return HTML",
        "If animation_obj is provided and env is script: call plt.show()",
        "If fig is provided: call plt.tight_layout() then plt.show()",
        "Return None"
      ],

      mathFormula: null,

      example: `# Usually called internally by visualization methods.
# But you can use it directly:

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
model.show(fig=fig)  # handles env detection

# For animations:
anim = model.animate_training(X, y, display=False)
model.show(animation_obj=anim)`,

      inputExample: `import matplotlib.pyplot as plt

# Create a custom figure
fig, ax = plt.subplots(figsize=(8, 5))
ax.scatter(X, y, color='gray')
ax.set_title('My Custom Plot')

# Display using LineSight's environment detection
model.show(fig=fig)`,

      outputExample: `# In Jupyter/Colab:
#   → Figure renders inline in the notebook cell
#   → Returns None

# In script mode:
#   → Interactive matplotlib window opens
#   → Returns None

# For animations in Jupyter:
#   → Returns HTML object with play/pause controls
#   → Interactive animation embedded in cell`,

      seeAlso: ["save", "plot_fit"]
    },

    // ─────────────────────────────────────────────
    // save()
    // ─────────────────────────────────────────────
    save: {
      name: "save",
      signature: "model.save(filepath, fig=None, animation_obj=None, dpi=150, fps=20)",
      category: "core",
      models: ["All Models"],
      source: "base.py",
      shortDesc: "Export a figure or animation to disk in PNG, PDF, SVG, GIF, or MP4 format.",
      longDesc: `Exports a matplotlib figure or animation to a file on disk. The output format is determined by the file extension in the provided filepath.

Supported formats for figures: \`.png\`, \`.pdf\`, \`.svg\`.
Supported formats for animations: \`.gif\` (via Pillow) and \`.mp4\` (via ffmpeg \u2014 must be installed separately).

To obtain a figure or animation object for saving, call the visualization method with \`display=False\`:
\`\`\`python
fig = model.plot_fit(X, y, display=False)
model.save("fit.png", fig=fig)
\`\`\`

**When to use**: Use \`save()\` whenever you need a publication-quality or presentation-ready export of any LineSight visualization. Typical scenarios include generating figures for academic papers, slide decks, homework submissions, or project documentation.

**Format selection guide**: Use \`.png\` for general-purpose raster output. Use \`.pdf\` or \`.svg\` for vector graphics suited to publications and presentations (resolution-independent). Use \`.gif\` for shareable web-friendly animations. Use \`.mp4\` for video presentations (requires ffmpeg).

**Performance characteristics**: Static figures export instantly. GIF animations may take several seconds for sequences exceeding 100 frames. MP4 encoding is the fastest animation format but requires an ffmpeg installation.`,

      parameters: [
        {
          name: "filepath",
          type: "str",
          default: null,
          required: true,
          desc: "Full path including extension. For figures: .png, .pdf, .svg. For animations: .gif or .mp4."
        },
        {
          name: "fig",
          type: "matplotlib.figure.Figure, optional",
          default: "None",
          required: false,
          desc: "Figure object to save. Get it by calling a plot method with `display=False`."
        },
        {
          name: "animation_obj",
          type: "FuncAnimation, optional",
          default: "None",
          required: false,
          desc: "Animation object to save. Get it from `animate_training(display=False)`."
        },
        {
          name: "dpi",
          type: "int",
          default: "150",
          required: false,
          desc: "Resolution for raster formats (PNG, GIF). Higher = larger file but sharper."
        },
        {
          name: "fps",
          type: "int",
          default: "20",
          required: false,
          desc: "Frames per second for animation exports (GIF, MP4)."
        }
      ],

      returns: {
        type: "str",
        desc: "The filepath that was saved to, for confirmation."
      },

      raises: [
        {
          exception: "ValueError",
          condition: "Neither `fig` nor `animation_obj` is provided",
          message: "\"Pass either fig= or animation_obj= to save(). Get the object by calling the visualization method with display=False.\""
        },
        {
          exception: "ImportError",
          condition: "Saving .mp4 but ffmpeg is not installed",
          message: "\"Saving .mp4 requires ffmpeg installed on your system. Install it with: conda install ffmpeg. Or save as .gif instead.\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check that at least one of fig or animation_obj is provided",
        "If fig: call `fig.savefig(filepath, dpi=dpi, bbox_inches='tight')`",
        "If animation and .gif: save with Pillow writer",
        "If animation and .mp4: save with ffmpeg writer (catch ImportError)",
        "Print confirmation message",
        "Return the filepath"
      ],

      mathFormula: null,

      example: `# Save a static plot
fig = model.plot_fit(X, y, display=False)
model.save("regression_fit.png", fig=fig, dpi=300)

# Save an animation as GIF
anim = model.animate_training(X, y, display=False)
model.save("training.gif", animation_obj=anim, fps=15)

# Save as PDF (vector graphics)
fig = model.plot_residuals(X, y, display=False)
model.save("residuals.pdf", fig=fig)`,

      inputExample: `# Step 1: Generate a plot with display=False
fig = model.plot_fit(X, y, display=False)

# Step 2: Save to disk
result = model.save("my_plot.png", fig=fig, dpi=300)`,

      outputExample: `# Console output:
Saved to: my_plot.png

# Return value: str
result → "my_plot.png"

# File created on disk:
#   my_plot.png  (300 DPI, ~150KB)
#   Format determined by file extension`,

      seeAlso: ["show", "plot_fit", "animate_training"]
    },

    // ─────────────────────────────────────────────
    // show_equation()
    // ─────────────────────────────────────────────
    show_equation: {
      name: "show_equation",
      signature: "model.show_equation()",
      category: "explain",
      models: ["LinearRegression"],
      source: "regression/linear/explain/show_equation.py",
      shortDesc: "Format and return the learned regression equation as a human-readable mathematical expression.",
      longDesc: `Formats the learned slope and intercept into a clean mathematical equation string with proper sign handling \u2014 negative intercepts produce a minus sign rather than the ambiguous \"+ -0.8\" pattern.

Values are rounded to 4 decimal places. The equation is printed to stdout in script mode and returned as a string in all environments.

**When to use**: Call \`show_equation()\` to view the mathematical relationship the model has learned. It provides the most direct answer to the question \"what did my model discover?\" in a single readable line.

**Pedagogical design**: This method bridges the gap between abstract weight values (\`model.m\` and \`model.b\`) and the familiar textbook equation (\`y = mx + b\`). It demonstrates that gradient descent recovers a recognizable, interpretable equation from raw data.

**Formatting details**: The intercept sign is handled automatically. A positive intercept produces \"y = 2.5x + 1.0\" while a negative intercept produces \"y = 2.5x - 1.0\" \u2014 ensuring clean, mathematically conventional notation.`,

      parameters: [],

      returns: {
        type: "str",
        desc: "The equation string, e.g., \"y = 3.4200x + 1.2000\" or \"y = 3.4200x - 0.8000\""
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model has not been fitted",
          message: "\"Call fit(X, y) before calling show_equation().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check that model is fitted",
        "Round slope (m) and intercept (b) to 4 decimal places",
        "Format string with correct sign handling for negative intercept",
        "Print to stdout in script mode",
        "Return the equation string"
      ],

      mathFormula: `Output format:
  y = {m}x + {b}     (when b ≥ 0)
  y = {m}x - {|b|}   (when b < 0)`,

      example: `model.fit(X, y)
eq = model.show_equation()
# Output: "y = 2.5012x + 0.9834"

# In Jupyter, the return value displays automatically:
model.show_equation()  # → "y = 2.5012x + 0.9834"`,

      inputExample: `# After fitting a model on data:
model.fit(X, y)

# Get the learned equation:
eq = model.show_equation()`,

      outputExample: `# Printed to stdout:
y = 2.5012x + 0.9834

# Return value: str
eq → "y = 2.5012x + 0.9834"

# With negative intercept:
# eq → "y = 3.4200x - 0.8000"  (not "+ -0.8000")`,

      seeAlso: ["explain_coefficients", "explain_fit", "summary"]
    },

    // ─────────────────────────────────────────────
    // explain_coefficients()
    // ─────────────────────────────────────────────
    explain_coefficients: {
      name: "explain_coefficients",
      signature: "model.explain_coefficients()",
      category: "explain",
      models: ["LinearRegression"],
      source: "regression/linear/explain/explain_coefficients.py",
      shortDesc: "Produce a natural-language interpretation of each learned model coefficient.",
      longDesc: `Translates numerical coefficients into human-readable sentences that explain the practical meaning of the slope and intercept in context.

For the slope: describes the direction and magnitude of the relationship ("For every 1-unit increase in the input, the predicted output increases/decreases by X").

For the intercept: explains the baseline prediction ("When the input is 0, the model predicts X").

**When to use**: After training, call this method to obtain a non-technical interpretation of the learned parameters. Particularly valuable when the mathematical coefficients need to be communicated to stakeholders or when connecting abstract values to real-world meaning.

**Pedagogical design**: In statistics education, coefficient interpretation is a critical skill that extends beyond computation. This method automates and models that interpretation process, teaching by example how to describe regression results in accessible language.

**Edge case handling**: A slope of exactly 0 is described as "no linear relationship" between input and output. Very small slopes include a qualifier noting the weak relationship.`,

      parameters: [],

      returns: {
        type: "str",
        desc: "Multi-line explanation text. Also printed to stdout in script mode."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model has not been fitted",
          message: "\"Call fit(X, y) before calling explain_coefficients().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check that model is fitted",
        "Round m and b to 4 decimal places",
        "Determine direction word: 'increases' if m > 0, 'decreases' if m < 0",
        "Format multi-line explanation string",
        "Print in script mode, return string always"
      ],

      mathFormula: null,

      example: `model.fit(X, y)
model.explain_coefficients()

# Output:
# Slope (coef_): 3.42
#   For every 1-unit increase in the input,
#   the predicted output increases by 3.42.
#
# Intercept: 1.20
#   When the input is 0, the model predicts 1.20.`,

      inputExample: `# After fitting:
model.explain_coefficients()`,

      outputExample: `# Printed to stdout:

Slope (coef_): 3.4200
  For every 1-unit increase in the input,
  the predicted output increases by 3.4200.

Intercept: 1.2000
  When the input is 0, the model predicts 1.2000.

# Return value: str (the same text above)`,

      seeAlso: ["show_equation", "explain_fit", "summary"]
    },

    // ─────────────────────────────────────────────
    // explain_fit()
    // ─────────────────────────────────────────────
    explain_fit: {
      name: "explain_fit",
      signature: "model.explain_fit(X, y)",
      category: "explain",
      models: ["All Regression Models"],
      source: "regression/linear/explain/explain_fit.py",
      shortDesc: "Generate a comprehensive fit quality report with metrics and plain-English interpretations.",
      longDesc: `Computes R², RMSE, MAE, and MSE, then explains each metric in plain English so the reader understands what the numbers MEAN, not just what they are.

Each metric comes with a one-sentence interpretation:
- R²: \"The model explains X% of the variance in y.\"
- RMSE: \"On average, predictions are off by ±X in the same units as y.\"
- MAE: \"The average absolute prediction error is X units.\"
- MSE: \"RMSE squared — used internally by gradient descent.\"`,

      parameters: [
        {
          name: "X",
          type: "array-like",
          default: null,
          required: true,
          desc: "Feature matrix for evaluation."
        },
        {
          name: "y",
          type: "array-like",
          default: null,
          required: true,
          desc: "True target values to evaluate against."
        }
      ],

      returns: {
        type: "str",
        desc: "Multi-line summary text with all metrics and explanations."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model has not been fitted",
          message: "\"Call fit(X, y) before calling explain_fit().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check that model is fitted",
        "Validate X and y",
        "Generate predictions via `self.predict(X)`",
        "Compute R², RMSE, MAE, MSE (rounded to 4 places)",
        "Convert R² to percentage",
        "Format multi-line explanation with each metric + interpretation",
        "Print in script mode, return string always"
      ],

      mathFormula: `R²   = 1 - Σ(yᵢ - ŷᵢ)² / Σ(yᵢ - ȳ)²
RMSE = √((1/n) × Σ(yᵢ - ŷᵢ)²)
MAE  = (1/n) × Σ|yᵢ - ŷᵢ|
MSE  = (1/n) × Σ(yᵢ - ŷᵢ)²`,

      example: `model.fit(X, y)
model.explain_fit(X, y)

# Output:
# Model fit summary
# ------------------------------
# R^2   = 0.998
#      The model explains 99.8% of the variance in y.
#      (1.0 = perfect fit, 0.0 = no better than the mean)
#
# RMSE = 0.35
#      On average, predictions are off by +/-0.35 (same units as y).
#
# MAE  = 0.28
#      The average absolute prediction error is 0.28 units.
#
# MSE  = 0.1225
#      (RMSE squared — used internally by gradient descent)`,

      inputExample: `# After fitting:
model.explain_fit(X, y)`,

      outputExample: `# Printed to stdout:

Model fit summary
------------------------------
R²   = 0.998
     The model explains 99.8% of the variance in y.
     (1.0 = perfect fit, 0.0 = no better than the mean)

RMSE = 0.35
     On average, predictions are off by ±0.35 (same units as y).

MAE  = 0.28
     The average absolute prediction error is 0.28 units.

MSE  = 0.1225
     (RMSE squared — used internally by gradient descent)

# Return value: str (the formatted text above)`,

      seeAlso: ["score", "show_equation", "summary"]
    },

    // ─────────────────────────────────────────────
    // plot_fit()
    // ─────────────────────────────────────────────
    plot_fit: {
      name: "plot_fit",
      signature: "model.plot_fit(X, y, show_residuals=True, display=True)",
      category: "visualization",
      models: ["LinearRegression"],
      source: "regression/linear/visualization/plot_fit.py",
      shortDesc: "Render a scatter plot with the fitted regression line and optional color-coded residual bars.",
      longDesc: `Creates a 2D scatter plot with the learned regression line overlaid. When \`show_residuals=True\`, vertical dashed lines are drawn from each data point to the regression line, colored by direction:
- Red dashes = point is ABOVE the line (model under-predicted, positive residual)
- Blue dashes = point is BELOW the line (model over-predicted, negative residual)

This teaches the student VISUALLY what residuals are — the vertical distances the MSE loss function is trying to minimize.

The plot title shows the learned equation. Only works for single-feature models (2-D plots).`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n,) or (n, 1)",
          default: null,
          required: true,
          desc: "Single feature array. Must have exactly 1 feature."
        },
        {
          name: "y",
          type: "array-like, shape (n,)",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "show_residuals",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, draws vertical dashed lines from each data point to the regression line."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays the plot. If False, returns the matplotlib Figure object without displaying."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "Returns None if `display=True` (plot is shown). Returns the Figure object if `display=False` (for saving or further customization)."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model has not been fitted",
          message: "\"Call fit(X, y) before calling plot_fit().\""
        },
        {
          exception: "LineSightShapeError",
          condition: "X has more than 1 feature",
          message: "\"plot_fit() only works for single-feature models. Your X has {n} features. For multi-feature models, use plot_partial_regression(feature_idx=0).\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check fitted, validate X and y",
        "Verify X has exactly 1 feature",
        "Compute predictions",
        "Draw residual bars (if enabled): red for y > ŷ, blue for y < ŷ",
        "Draw scatter plot of data points (gray with white edges)",
        "Draw regression line from min(X) to max(X) (blue)",
        "Set title to equation, add axis labels and legend",
        "Print pedagogical context (theory, formula, how to read)",
        "Display or return figure"
      ],

      mathFormula: `y = m·x + b
MSE = (1/n) × Σ(yᵢ - (m·xᵢ + b))²

Residual_i = yᵢ - ŷᵢ
  Positive residual → red bar (model under-predicted)
  Negative residual → blue bar (model over-predicted)`,

      example: `model.fit(X, y)

# Show with residual bars
model.plot_fit(X, y)

# Without residual bars
model.plot_fit(X, y, show_residuals=False)

# Save to file
fig = model.plot_fit(X, y, display=False)
model.save("fit_plot.png", fig=fig)`,

      inputExample: `import numpy as np
from linesight import LinearRegression

X = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
y = np.array([2.1, 4.0, 5.8, 8.1, 9.9])

model = LinearRegression(learning_rate=0.01, epochs=1000)
model.fit(X, y)

# Plot the fitted line with residual bars
model.plot_fit(X, y, show_residuals=True)`,

      outputExample: `# Displays a matplotlib figure showing:
#   • Gray scatter points for each (x, y) data point
#   • Blue regression line: y = 1.98x + 0.12
#   • Red dashed bars: points ABOVE the line (under-predicted)
#   • Blue dashed bars: points BELOW the line (over-predicted)
#   • Title: "y = 1.9800x + 0.1200"
#   • Legend with "Data" and "Fit" entries

# Return value:
#   display=True  → None (figure shown)
#   display=False → matplotlib.figure.Figure object`,

      seeAlso: ["plot_residuals", "plot_actual_vs_predicted", "animate_training"]
    },

    // ─────────────────────────────────────────────
    // plot_residuals()
    // ─────────────────────────────────────────────
    plot_residuals: {
      name: "plot_residuals",
      signature: "model.plot_residuals(X, y, display=True)",
      category: "visualization",
      models: ["All Models"],
      source: "regression/linear/visualization/plot_residuals.py",
      shortDesc: "Generate a residual diagnostic plot (actual − predicted) against fitted values.",
      longDesc: `Creates a scatter plot with fitted values (ŷ) on the x-axis and residuals (y − ŷ) on the y-axis. A horizontal dashed line at y=0 marks where a perfect model would sit.

Points are colored by residual direction:
- Red = positive residual (model under-predicted)
- Blue = negative residual (model over-predicted)

What to look for:
- **Random scatter around zero** = linear model is correct, assumptions met
- **Curved / U-shaped pattern** = linear model is wrong, try polynomial regression
- **Funnel shape (spread widens)** = heteroscedasticity (variance not constant)
- **Outliers far from zero** = influential data points heavily affecting the model`,

      parameters: [
        {
          name: "X",
          type: "array-like",
          default: null,
          required: true,
          desc: "Feature matrix."
        },
        {
          name: "y",
          type: "array-like",
          default: null,
          required: true,
          desc: "True target values."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays the plot. If False, returns the Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model not fitted",
          message: "\"Call fit(X, y) before calling plot_residuals().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check fitted, validate X and y",
        "Compute predictions and residuals: r = y - ŷ",
        "Color each residual: red if positive, blue if negative",
        "Draw scatter plot of (ŷ, residual) pairs",
        "Draw horizontal dashed line at y=0",
        "Print pedagogical context explaining patterns to look for"
      ],

      mathFormula: `Residual_i = yᵢ - ŷᵢ = yᵢ - (m·xᵢ + b)

A well-specified model produces residuals that are:
  • Centered at zero
  • Randomly scattered (no pattern)
  • Constant variance (homoscedastic)`,

      example: `model.fit(X, y)
model.plot_residuals(X, y)

# Save for a report
fig = model.plot_residuals(X, y, display=False)
model.save("residual_analysis.png", fig=fig)`,

      inputExample: `# After fitting the model:
model.plot_residuals(X, y)`,

      outputExample: `# Displays a scatter plot showing:
#   • X-axis: Fitted values (ŷ)
#   • Y-axis: Residuals (y - ŷ)
#   • Red dots: positive residuals (model under-predicted)
#   • Blue dots: negative residuals (model over-predicted)
#   • Dashed horizontal line at y=0
#
# What to look for:
#   Random scatter → good model
#   U-shaped curve  → try polynomial regression
#   Funnel shape    → heteroscedasticity

# Return value:
#   display=True  → None
#   display=False → matplotlib.figure.Figure`,

      seeAlso: ["plot_fit", "plot_actual_vs_predicted", "explain_fit"]
    },

    // ─────────────────────────────────────────────
    // plot_loss_curve()
    // ─────────────────────────────────────────────
    plot_loss_curve: {
      name: "plot_loss_curve",
      signature: "model.plot_loss_curve(display=True)",
      category: "visualization",
      models: ["All Models"],
      source: "regression/linear/visualization/plot_loss_curve.py",
      shortDesc: "Visualize training convergence by plotting MSE loss as a function of epoch.",
      longDesc: `Shows how the loss decreases over training epochs. Requires \`store_history=True\` during model creation.

The curve shape teaches important concepts:
- **Steep initial drop** = fast early learning (large gradients)
- **Gradual flattening** = approaching the minimum (converging)
- **Completely flat early** = learning rate too small or trivial data
- **Spike or divergence upward** = learning rate too high

The final loss value is annotated on the last point with a red dot.`,

      parameters: [
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays the plot. If False, returns the Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`. Returns None if no history."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model not fitted",
          message: "\"Call fit(X, y) before calling plot_loss_curve().\""
        }
      ],

      warns: [
        {
          warning: "LineSightDataWarning",
          condition: "`store_history=False`",
          message: "\"No history to plot. Re-fit with store_history=True.\""
        }
      ],

      internalSteps: [
        "Check fitted",
        "Check if history is empty — return None with warning if so",
        "Plot loss values against epoch numbers",
        "Annotate final loss value with red dot",
        "Print pedagogical context about loss curve shapes"
      ],

      mathFormula: `J(epoch) = (1/n) × Σ(yᵢ - ŷᵢ)²

The loss should be monotonically decreasing.
If it increases, the learning rate is too high.`,

      example: `model = LinearRegression(
    learning_rate=0.01, epochs=1000,
    store_history=True   # Required!
)
model.fit(X, y)
model.plot_loss_curve()`,

      inputExample: `# Model trained with store_history=True:
model = LinearRegression(
    learning_rate=0.01, epochs=1000,
    store_history=True
)
model.fit(X, y)

model.plot_loss_curve()`,

      outputExample: `# Displays a line plot showing:
#   • X-axis: Epoch number (0 to 1000)
#   • Y-axis: MSE Loss value
#   • Curve starts high (~29.6) and drops to ~0.015
#   • Red dot on the final loss value: 0.0148
#   • Title: "Training Loss (MSE) over Epochs"
#
# Curve shapes:
#   Steep drop → fast early learning
#   Flat tail   → converged
#   Spike up    → learning rate too high

# Return: None (displayed) or Figure (display=False)`,

      seeAlso: ["fit", "get_training_history", "compare_learning_rates"]
    },

    // ─────────────────────────────────────────────
    // animate_training()
    // ─────────────────────────────────────────────
    animate_training: {
      name: "animate_training",
      signature: "model.animate_training(X, y, interval=50, skip_frames=5, display=True)",
      category: "visualization",
      models: ["LinearRegression"],
      source: "regression/linear/visualization/animate_training.py",
      shortDesc: "Generate a frame-by-frame animation of gradient descent converging to the optimal regression line.",
      longDesc: `Creates an animation showing the regression line starting from a random guess (m=0, b=0) and physically shifting, tilting, and moving step-by-step into the optimal fit over epochs.

Each frame shows:
- The current epoch number and loss value
- The current equation (y = m*x ± b)
- The regression line at that epoch's parameters
- On the final frame: a warning if the model hasn't converged

Requires \`store_history=True\` during model creation. Only works for single-feature models.

In Jupyter: returns an interactive HTML animation with play/pause controls.
In script mode: opens an animated matplotlib window.`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n, 1)",
          default: null,
          required: true,
          desc: "Single feature array."
        },
        {
          name: "y",
          type: "array-like, shape (n,)",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "interval",
          type: "int",
          default: "50",
          required: false,
          desc: "Milliseconds between frames. Lower = faster animation."
        },
        {
          name: "skip_frames",
          type: "int",
          default: "5",
          required: false,
          desc: "Render every Nth epoch. Higher = fewer frames, faster build, less smooth."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns the FuncAnimation object."
        }
      ],

      returns: {
        type: "HTML | FuncAnimation | None",
        desc: "In Jupyter: HTML animation. In script: None (window opens). With `display=False`: FuncAnimation object."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model not fitted",
          message: "\"Call fit(X, y) before calling animate_training().\""
        },
        {
          exception: "LineSightShapeError",
          condition: "X has more than 1 feature",
          message: "\"animate_training() only works for single-feature (LinearRegression) models.\""
        }
      ],

      warns: [
        {
          warning: "LineSightDataWarning",
          condition: "`store_history=False`",
          message: "\"No history to animate. Re-fit with store_history=True.\""
        }
      ],

      internalSteps: [
        "Check fitted and history availability",
        "Validate X shape (must be 1 feature)",
        "Extract m_history, b_history, losses from training history",
        "Select frame indices at skip_frames interval (always include last)",
        "Create figure with data scatter plot",
        "For each frame: update line position, equation text, epoch/loss title",
        "On final frame: show convergence warning if not converged",
        "Build FuncAnimation and display or return"
      ],

      mathFormula: null,

      example: `model = LinearRegression(
    learning_rate=0.01, epochs=500,
    store_history=True
)
model.fit(X, y)

# In Jupyter — interactive animation
model.animate_training(X, y)

# Save as GIF
anim = model.animate_training(X, y, display=False)
model.save("convergence.gif", animation_obj=anim)`,

      inputExample: `# Model trained with store_history=True:
model = LinearRegression(
    learning_rate=0.01, epochs=500,
    store_history=True
)
model.fit(X, y)

# Watch gradient descent converge:
model.animate_training(X, y, interval=50, skip_frames=5)`,

      outputExample: `# Displays an animated plot showing:
#   • Data points as gray scatter
#   • Regression line moving from m=0, b=0 toward optimal fit
#   • Each frame: line tilts and shifts to new position
#   • Title updates: "Epoch 25 | Loss: 12.443 | y = 0.48x + 0.03"
#   • Final frame: converged line + "Converged" or warning
#
# In Jupyter: interactive HTML with play/pause controls
# In script: animated matplotlib window

# Return: HTML (Jupyter) | None (script) | FuncAnimation (display=False)`,

      seeAlso: ["plot_fit", "plot_loss_curve", "animate_loss_surface_path"]
    },

    // ─────────────────────────────────────────────
    // plot_loss_surface()
    // ─────────────────────────────────────────────
    plot_loss_surface: {
      name: "plot_loss_surface",
      signature: "model.plot_loss_surface(X, y, m_range=None, b_range=None, grid_points=50, display=True)",
      category: "visualization",
      models: ["LinearRegression"],
      source: "regression/linear/visualization/plot_loss_surface.py",
      shortDesc: "Render the 3D MSE loss surface over the slope\u2013intercept parameter space.",
      longDesc: `Computes the MSE loss for a grid of possible (slope, intercept) combinations and renders a 3D surface plot — the famous \"bowl\" that gradient descent rolls down.

The surface shape shows WHY gradient descent works: loss decreases in all directions toward a single minimum (convexity). A red dot marks the model's fitted parameters on the surface.

If \`store_history=True\`, the optimization path is drawn on the surface as a red line, showing the actual route gradient descent took from the starting point to the minimum.

**Performance note**: Computes loss for grid_points² parameter combinations. With grid_points=50 and n=10000 samples, this is 25M multiplications. A warning is issued for datasets larger than 5000 samples.`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n, 1)",
          default: null,
          required: true,
          desc: "Single feature array."
        },
        {
          name: "y",
          type: "array-like, shape (n,)",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "m_range",
          type: "tuple (min, max), optional",
          default: "None",
          required: false,
          desc: "Range of slope values to plot. Default: fitted m ± 3 × |fitted m|."
        },
        {
          name: "b_range",
          type: "tuple (min, max), optional",
          default: "None",
          required: false,
          desc: "Range of intercept values. Default: fitted b ± 3 × |fitted b| + 1."
        },
        {
          name: "grid_points",
          type: "int",
          default: "50",
          required: false,
          desc: "Resolution of the surface grid. Higher = smoother but slower."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model not fitted",
          message: "\"Call fit(X, y) before calling plot_loss_surface().\""
        }
      ],

      warns: [
        {
          warning: "LineSightDataWarning",
          condition: "X has more than 1 feature",
          message: "\"plot_loss_surface() only works for single-feature models. For multi-feature models, the loss surface exists in N+1 dimensions.\""
        },
        {
          warning: "LineSightDataWarning",
          condition: "n_samples > 5000",
          message: "\"plot_loss_surface() on {n} samples may be slow. Consider passing a subset.\""
        }
      ],

      internalSteps: [
        "Check fitted, validate data",
        "Warn if multi-feature or large dataset",
        "Compute m_range and b_range if not provided (±3 × abs(fitted) or ±1)",
        "Create meshgrid of (m, b) combinations",
        "Vectorized loss computation using broadcasting: MSE at each (m, b) pair",
        "Render 3D surface with Blues colormap",
        "Plot fitted point as red dot on surface",
        "If history available: overlay optimization path as red line",
        "Print pedagogical context"
      ],

      mathFormula: `MSE(m, b) = (1/n) × Σ(yᵢ - (m·xᵢ + b))²

The surface is convex for linear regression (single global minimum).
Gradient descent step:
  m := m - lr × ∂MSE/∂m
  b := b - lr × ∂MSE/∂b`,

      example: `model = LinearRegression(
    learning_rate=0.01, epochs=1000,
    store_history=True
)
model.fit(X, y)

# Default ranges
model.plot_loss_surface(X, y)

# Custom range zoom
model.plot_loss_surface(X, y,
    m_range=(1.5, 3.5),
    b_range=(-1, 3),
    grid_points=80
)`,

      inputExample: `# After fitting:
model.plot_loss_surface(X, y)`,

      outputExample: `# Displays a 3D surface plot showing:
#   • X-axis: slope (m) values
#   • Y-axis: intercept (b) values
#   • Z-axis: MSE loss at each (m, b) combination
#   • Bowl-shaped surface (convex for linear regression)
#   • Red dot at the fitted parameters (minimum)
#   • Red line: optimization path (if store_history=True)
#
# The "bowl" shape shows WHY gradient descent works:
#   loss decreases in all directions toward a single minimum

# Return: None (displayed) or Figure (display=False)`,

      seeAlso: ["animate_loss_surface_path", "plot_loss_curve", "animate_training"]
    },

    // ─────────────────────────────────────────────
    // compare_learning_rates()
    // ─────────────────────────────────────────────
    compare_learning_rates: {
      name: "compare_learning_rates",
      signature: "model.compare_learning_rates(X, y, learning_rates=None, epochs=200, display=True)",
      category: "visualization",
      models: ["LinearRegression"],
      source: "regression/linear/visualization/compare_learning_rates.py",
      shortDesc: "Train with multiple learning rates independently and compare convergence behavior side by side.",
      longDesc: `Creates temporary model instances for each learning rate, trains them independently, and plots their loss curves in a grid of subplots. Each subplot is automatically diagnosed:

- **"Converged"** (green) — loss flattened out, good minimum found
- **"Diverged (LR too high)"** (red) — loss went to NaN/Inf
- **"Still decreasing"** (purple) — needs more epochs or higher LR
- **"Oscillating (LR slightly too high)"** (orange) — loss bouncing up and down

**Important**: Does NOT modify the current model. All training is done on temporary instances internally.`,

      parameters: [
        {
          name: "X",
          type: "array-like",
          default: null,
          required: true,
          desc: "Feature matrix."
        },
        {
          name: "y",
          type: "array-like",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "learning_rates",
          type: "list of float, optional",
          default: "[0.0001, 0.001, 0.01, 0.1]",
          required: false,
          desc: "Learning rates to compare. Default covers 4 orders of magnitude."
        },
        {
          name: "epochs",
          type: "int",
          default: "200",
          required: false,
          desc: "Epochs to train each comparison model."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model not fitted",
          message: "\"Call fit(X, y) before calling compare_learning_rates().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check fitted, validate data",
        "For each learning rate: create temp LinearRegression with store_history=True",
        "Train each temp model for the specified epochs",
        "Diagnose each loss curve: converged / diverged / still decreasing / oscillating",
        "Plot all loss curves in a grid (2 columns)",
        "Color-code titles by diagnosis"
      ],

      mathFormula: null,

      example: `model.fit(X, y)

# Default comparison
model.compare_learning_rates(X, y)

# Custom rates
model.compare_learning_rates(X, y,
    learning_rates=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5],
    epochs=500
)`,

      inputExample: `# After fitting:
model.compare_learning_rates(X, y,
    learning_rates=[0.0001, 0.001, 0.01, 0.1],
    epochs=200
)`,

      outputExample: `# Displays a 2×2 grid of subplots, one per learning rate:
#
# [0.0001] "Still decreasing" (purple)
#   • Loss barely moved — needs more epochs or higher LR
#
# [0.001] "Converged" (green)
#   • Loss dropped smoothly and flattened
#
# [0.01] "Converged" (green)
#   • Loss converged fastest
#
# [0.1] "Diverged (LR too high)" (red)
#   • Loss exploded to Inf
#
# Does NOT modify the current model

# Return: None (displayed) or Figure (display=False)`,

      seeAlso: ["plot_loss_curve", "fit"]
    },

    // ─────────────────────────────────────────────
    // plot_actual_vs_predicted()
    // ─────────────────────────────────────────────
    plot_actual_vs_predicted: {
      name: "plot_actual_vs_predicted",
      signature: "model.plot_actual_vs_predicted(X, y, display=True)",
      category: "visualization",
      models: ["All Regression Models"],
      source: "regression/linear/visualization/plot_actual_vs_predicted.py",
      shortDesc: "Scatter plot of actual y vs predicted ŷ — the universal fit diagnostic.",
      longDesc: `Plots actual target values on the x-axis against predicted values on the y-axis, with a diagonal y=x \"perfect prediction\" line for reference.

**Why this matters**: Unlike \`plot_fit()\` which only works for 1-feature models, this works for ALL regression types regardless of feature count, because both axes are scalar. It is the universal fit diagnostic.

How to read:
- **Tight cloud around diagonal** = good fit
- **Curved cloud** = relationship is non-linear (try polynomial)
- **Funnel shape** = heteroscedasticity (non-constant variance)
- **Points above diagonal** = model overestimated
- **Points below diagonal** = model underestimated

R² is shown in the corner, color-coded red if R² < 0.7.`,

      parameters: [
        {
          name: "X",
          type: "array-like",
          default: null,
          required: true,
          desc: "Feature matrix (any number of features)."
        },
        {
          name: "y",
          type: "array-like",
          default: null,
          required: true,
          desc: "True target values."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model not fitted",
          message: "\"Call fit(X, y) before calling plot_actual_vs_predicted().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check fitted, validate data",
        "Compute predictions",
        "Compute R² for annotation",
        "Draw scatter of (actual, predicted) pairs",
        "Draw diagonal y=x dashed line",
        "Set equal aspect ratio for honest visual comparison",
        "Color-code R² annotation red if < 0.7"
      ],

      mathFormula: `Perfect prediction: ŷ = y  (all points on diagonal)
R² shown in plot corner`,

      example: `model.fit(X, y)
model.plot_actual_vs_predicted(X, y)

# Works for multi-feature models too:
multi_model.fit(X_multi, y)
multi_model.plot_actual_vs_predicted(X_multi, y)`,

      inputExample: `# Works for ANY number of features:
model.fit(X, y)
model.plot_actual_vs_predicted(X, y)`,

      outputExample: `# Displays a scatter plot showing:
#   • X-axis: Actual y values
#   • Y-axis: Predicted ŷ values
#   • Diagonal dashed line: y = x (perfect predictions)
#   • Points close to diagonal = good predictions
#   • R² value displayed in corner (color-coded)
#     R² ≥ 0.7 → green text
#     R² < 0.7 → red text (poor fit)
#
# Unlike plot_fit(), this works with ANY number of features

# Return: None (displayed) or Figure (display=False)`,

      seeAlso: ["plot_fit", "plot_residuals", "score"]
    },

    // ─────────────────────────────────────────────
    // plot_learning_curve()
    // ─────────────────────────────────────────────
    plot_learning_curve: {
      name: "plot_learning_curve",
      signature: "model.plot_learning_curve(X, y, cv_splits=5, train_sizes=None, display=True)",
      category: "visualization",
      models: ["All Models"],
      source: "regression/linear/visualization/plot_learning_curve.py",
      shortDesc: "Plot training and validation performance as a function of dataset size to diagnose overfitting.",
      longDesc: `Trains temporary models on increasing subsets of the data and plots training score vs validation score. This is the classic diagnostic for overfitting vs underfitting.

How to read:
- **Training high, validation low (gap)** = overfitting
- **Both low and flat** = underfitting (model is too simple)
- **Validation rising toward training as n grows** = getting more data WILL help
- **Both high and close** = good model, enough data

Algorithm: for each train_size, randomly sample \`cv_splits\` subsets, train on each, score on both train and validation, then average. Uses R² for regression, accuracy for classification.`,

      parameters: [
        {
          name: "X",
          type: "array-like",
          default: null,
          required: true,
          desc: "Feature matrix."
        },
        {
          name: "y",
          type: "array-like",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "cv_splits",
          type: "int",
          default: "5",
          required: false,
          desc: "Number of random subsets to average for each train size. Higher = smoother but slower."
        },
        {
          name: "train_sizes",
          type: "list of int, optional",
          default: "None",
          required: false,
          desc: "Custom training sizes. Default: 10 sizes from 10% to 90% of dataset."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model not fitted",
          message: "\"Call fit(X, y) before calling plot_learning_curve().\""
        }
      ],

      warns: [],

      internalSteps: [
        "Check fitted, validate data",
        "Generate train_sizes if not provided (10% to 90%)",
        "For each size: do cv_splits random train/val splits",
        "Train temporary model on each split, score both sets",
        "Average scores across splits",
        "Plot training (blue) and validation (red dashed) curves",
        "Add horizontal reference line at 1.0"
      ],

      mathFormula: null,

      example: `model.fit(X, y)
model.plot_learning_curve(X, y)

# More granular with more CV splits
model.plot_learning_curve(X, y, cv_splits=10)`,

      inputExample: `# After fitting:
model.plot_learning_curve(X, y, cv_splits=5)`,

      outputExample: `# Displays a plot with two curves:
#   • Blue line: Training score (R²) vs dataset size
#   • Red dashed: Validation score (R²) vs dataset size
#   • X-axis: Number of training samples (10% to 90%)
#   • Y-axis: R² score (0 to 1)
#   • Horizontal line at 1.0 for reference
#
# How to read:
#   Both high + close   → good model, enough data
#   Train high, val low → overfitting
#   Both low + flat     → underfitting

# Return: None (displayed) or Figure (display=False)`,

      seeAlso: ["score", "plot_actual_vs_predicted"]
    },

    // ─────────────────────────────────────────────
    // plot_gradient_vectors()
    // ─────────────────────────────────────────────
    plot_gradient_vectors: {
      name: "plot_gradient_vectors",
      signature: "model.plot_gradient_vectors(X, y, scale=0.3, display=True)",
      category: "visualization",
      models: ["LinearRegression"],
      source: "regression/linear/visualization/plot_gradient_vectors.py",
      shortDesc: "Render per-data-point gradient contribution arrows to visualize the direction and magnitude of each sample's influence.",
      longDesc: `Shows exactly HOW each data point pushes the regression line during a gradient descent step. Each arrow represents one point's gradient contribution.

- A point ABOVE the line (positive residual) pulls the line UP → red arrow
- A point BELOW the line (negative residual) pulls the line DOWN → blue arrow
- Arrow length = magnitude of that point's gradient contribution

The net gradient is annotated in the top-left corner showing the aggregate direction the model would update.

**Best with ≤ 100 samples** — more points make the arrows cluttered (a warning is issued for n > 200).`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n, 1)",
          default: null,
          required: true,
          desc: "Single feature array."
        },
        {
          name: "y",
          type: "array-like, shape (n,)",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "scale",
          type: "float",
          default: "0.3",
          required: false,
          desc: "Arrow length multiplier. Increase if arrows are too small, decrease if they overlap."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`."
      },

      raises: [
        {
          exception: "LineSightNotFittedError",
          condition: "Model not fitted",
          message: "\"Call fit(X, y) before calling plot_gradient_vectors().\""
        },
        {
          exception: "LineSightShapeError",
          condition: "X has more than 1 feature",
          message: "\"plot_gradient_vectors() requires exactly 1 feature. Your X has {n} features.\""
        }
      ],

      warns: [
        {
          warning: "LineSightDataWarning",
          condition: "n_samples > 200",
          message: "\"plot_gradient_vectors() on {n} samples may be cluttered. Consider passing a subset.\""
        }
      ],

      internalSteps: [
        "Check fitted, validate data, verify 1 feature",
        "Warn if too many samples",
        "Compute predictions and residuals",
        "Compute net slope and intercept gradients",
        "Draw regression line",
        "For each point: draw colored arrow from point toward line",
        "Annotate net gradient direction in corner"
      ],

      mathFormula: `Contribution of point i to slope gradient:
  (ŷᵢ - yᵢ) × xᵢ

Net slope gradient:
  ∂J/∂m = (2/n) × Σ((ŷᵢ - yᵢ) × xᵢ)

Net intercept gradient:
  ∂J/∂b = (2/n) × Σ(ŷᵢ - yᵢ)`,

      example: `model.fit(X, y)

# Default scale
model.plot_gradient_vectors(X, y)

# Larger arrows
model.plot_gradient_vectors(X[:50], y[:50], scale=0.5)`,

      inputExample: `# Best with ≤100 data points:
model.fit(X[:50], y[:50])
model.plot_gradient_vectors(X[:50], y[:50], scale=0.3)`,

      outputExample: `# Displays a plot showing:
#   • Regression line in blue
#   • Data points as dots
#   • Red arrows: points ABOVE line pulling it UP
#   • Blue arrows: points BELOW line pulling it DOWN
#   • Arrow length = gradient contribution magnitude
#   • Net gradient annotation: "∂J/∂m = -2.34, ∂J/∂b = -0.81"
#
# Shows exactly HOW each point influences the gradient step

# Return: None (displayed) or Figure (display=False)`,

      seeAlso: ["plot_fit", "plot_loss_surface", "animate_training"]
    },

    // ─────────────────────────────────────────────
    // plot_prediction_intervals()
    // ─────────────────────────────────────────────
    plot_prediction_intervals: {
      name: "plot_prediction_intervals",
      signature: "model.plot_prediction_intervals(X, y, confidence=0.95, display=True)",
      category: "visualization",
      models: ["LinearRegression"],
      source: "regression/linear/visualization/plot_prediction_intervals.py",
      shortDesc: "Overlay confidence and prediction interval bands on the regression line.",
      longDesc: `Shows two distinct uncertainty bands around the regression line:

**Confidence interval** (inner, darker band):
Uncertainty about WHERE THE MEAN LINE IS. Narrowest at x=x̄ (the mean of X), widens toward extremes.

**Prediction interval** (outer, lighter band):
Uncertainty about WHERE A NEW INDIVIDUAL POINT WILL FALL. Always wider than the confidence interval by the extra \"1 +\" term that accounts for individual random variation.

Uses the t-distribution for finite-sample correction. For n > 30, results are nearly identical to using z=1.96. For n < 30, the difference matters significantly.

If \`scipy\` is not installed, falls back to approximate z-values with a warning.`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n, 1)",
          default: null,
          required: true,
          desc: "Single feature array."
        },
        {
          name: "y",
          type: "array-like, shape (n,)",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "confidence",
          type: "float",
          default: "0.95",
          required: false,
          desc: "Confidence level. Must be between 0.5 and 0.999. Common: 0.90, 0.95, 0.99."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`."
      },

      raises: [
        {
          exception: "LineSightShapeError",
          condition: "X has more than 1 feature",
          message: "\"plot_prediction_intervals() only works for single-feature models.\""
        },
        {
          exception: "LineSightShapeError",
          condition: "confidence not in [0.5, 0.999]",
          message: "\"confidence must be between 0.5 and 0.999.\""
        }
      ],

      warns: [
        {
          warning: "LineSightDataWarning",
          condition: "n < 10",
          message: "\"Only {n} samples. Prediction intervals will be very wide and unreliable.\""
        },
        {
          warning: "LineSightDataWarning",
          condition: "scipy not installed",
          message: "\"scipy not installed. Using approximate t critical value.\""
        }
      ],

      internalSteps: [
        "Check fitted, validate data, verify 1 feature",
        "Validate confidence range",
        "Warn if small sample size",
        "Compute residual standard error: s = √(MSE × n/(n-2))",
        "Get t-critical value from scipy (or approximate fallback)",
        "Compute SE_mean and SE_pred at each x point",
        "Calculate CI and PI bands: ŷ ± t × SE",
        "Draw prediction interval (outer, lighter), confidence interval (inner, darker), regression line, and data points"
      ],

      mathFormula: `Confidence Interval:
  ŷ ± t × s × √(1/n + (x - x̄)² / Σ(xᵢ - x̄)²)

Prediction Interval:
  ŷ ± t × s × √(1 + 1/n + (x - x̄)² / Σ(xᵢ - x̄)²)

where:
  s = √(MSE × n / (n-2))   (residual standard error)
  t = t-distribution critical value for (n-2) df`,

      example: `model.fit(X, y)

# 95% intervals (default)
model.plot_prediction_intervals(X, y)

# 99% intervals
model.plot_prediction_intervals(X, y, confidence=0.99)`,

      inputExample: `# After fitting:
model.plot_prediction_intervals(X, y, confidence=0.95)`,

      outputExample: `# Displays a plot with 4 layers:
#   • Light blue band: 95% Prediction interval (outer)
#     "Where a NEW individual point will fall"
#   • Dark blue band: 95% Confidence interval (inner)
#     "Where the TRUE mean line is"
#   • Blue regression line: y = mx + b
#   • Gray scatter: actual data points
#
# Both bands are narrowest at x = mean(X)
# and widen toward the extremes
#
# Title: "95% Confidence and Prediction Intervals"

# Return: None (displayed) or Figure (display=False)`,

      seeAlso: ["plot_fit", "explain_fit"]
    },

    // ─────────────────────────────────────────────
    // animate_loss_surface_path()
    // ─────────────────────────────────────────────
    animate_loss_surface_path: {
      name: "animate_loss_surface_path",
      signature: "model.animate_loss_surface_path(X, y, grid_points=40, skip_frames=10, interval=60, display=True)",
      category: "visualization",
      models: ["LinearRegression"],
      source: "regression/linear/visualization/animate_loss_surface_path.py",
      shortDesc: "Animate the optimization path as a moving point traversing the 3D MSE loss surface.",
      longDesc: `Combines the 3D loss surface with an animated red dot that traces the actual optimization path epoch by epoch. The surface is computed once, then each frame moves the dot to the next (m, b) position from training history.

Frame 0: surface rendered, red dot at starting position (m=0, b=0)
Each frame: red dot moves, trail line builds up behind it
Final frame: dot sits at the bottom of the bowl (the optimum)

**Performance**: The surface is expensive to compute. Keep grid_points ≤ 60 (default 40). Higher values can take >30 seconds to build.`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n, 1)",
          default: null,
          required: true,
          desc: "Single feature array."
        },
        {
          name: "y",
          type: "array-like, shape (n,)",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "grid_points",
          type: "int",
          default: "40",
          required: false,
          desc: "Surface resolution. Do not exceed 60."
        },
        {
          name: "skip_frames",
          type: "int",
          default: "10",
          required: false,
          desc: "Animate every Nth epoch. 1000 epochs / 10 = 100 frames."
        },
        {
          name: "interval",
          type: "int",
          default: "60",
          required: false,
          desc: "Milliseconds between frames."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns FuncAnimation."
        }
      ],

      returns: {
        type: "HTML | FuncAnimation | None",
        desc: "In Jupyter: HTML animation. In script: None. With `display=False`: FuncAnimation."
      },

      raises: [
        {
          exception: "LineSightShapeError",
          condition: "X has more than 1 feature",
          message: "\"animate_loss_surface_path() requires single-feature X.\""
        }
      ],

      warns: [
        {
          warning: "LineSightDataWarning",
          condition: "store_history=False",
          message: "\"No history available. Re-fit with store_history=True.\""
        },
        {
          warning: "LineSightDataWarning",
          condition: "grid_points > 60",
          message: "\"grid_points={n} will make animation build very slow (>30s).\""
        }
      ],

      internalSteps: [
        "Check fitted and history availability",
        "Validate single-feature constraint",
        "Warn if high grid_points",
        "Build loss surface grid ONCE (vectorized computation)",
        "Select frame indices at skip_frames interval",
        "Render 3D surface",
        "For each frame: move red dot to (m, b, loss) from history, extend trail line",
        "Update title with epoch and loss"
      ],

      mathFormula: null,

      example: `model = LinearRegression(
    learning_rate=0.01, epochs=1000,
    store_history=True
)
model.fit(X, y)

# In Jupyter
model.animate_loss_surface_path(X, y)

# Save as GIF
anim = model.animate_loss_surface_path(X, y, display=False)
model.save("loss_path.gif", animation_obj=anim, fps=15)`,

      inputExample: `# Model trained with store_history=True:
model.animate_loss_surface_path(X, y,
    grid_points=40, skip_frames=10)`,

      outputExample: `# Displays an animated 3D surface plot:
#   • Static bowl-shaped loss surface
#   • Red dot moves along the optimization path
#   • Trail line builds up behind the dot
#   • Frame 0: dot at (m=0, b=0) — top of bowl
#   • Each frame: dot rolls downhill
#   • Final frame: dot at bottom of bowl (optimum)
#   • Title: "Epoch 250 | Loss: 0.0321"
#
# In Jupyter: HTML animation with play/pause
# In script: animated matplotlib window

# Return: HTML | None | FuncAnimation (display=False)`,

      seeAlso: ["plot_loss_surface", "animate_training", "plot_loss_curve"]
    },

    // ─────────────────────────────────────────────
    // plot_sensitivity_analysis()
    // ─────────────────────────────────────────────
    plot_sensitivity_analysis: {
      name: "plot_sensitivity_analysis",
      signature: "model.plot_sensitivity_analysis(X, y, top_n=3, display=True)",
      category: "visualization",
      models: ["LinearRegression"],
      source: "regression/linear/visualization/plot_sensitivity_analysis.py",
      shortDesc: "Perform leave-one-out sensitivity analysis to identify the most influential data points.",
      longDesc: `For each data point i, trains a temporary model on ALL OTHER points and records the resulting slope. Points whose removal causes the largest slope change are the most \"influential\".

**Left subplot**: Shows all leave-one-out regression lines overlaid in light gray. The original fitted line is shown in blue. The top_n most influential points are highlighted with red circles and labeled with their influence score.

**Right subplot**: Bar chart of influence scores (|slope_change|) for every sample, with the top_n bars in red.

**Key insight**: Influential points are not necessarily outliers. A perfectly on-line extreme point can be very influential without being an error.

**Performance**: Runs N separate model fits. For n > 500, a warning is issued suggesting to use a subset.`,

      parameters: [
        {
          name: "X",
          type: "array-like, shape (n, 1)",
          default: null,
          required: true,
          desc: "Single feature array."
        },
        {
          name: "y",
          type: "array-like, shape (n,)",
          default: null,
          required: true,
          desc: "Target values."
        },
        {
          name: "top_n",
          type: "int",
          default: "3",
          required: false,
          desc: "Number of most influential points to highlight."
        },
        {
          name: "display",
          type: "bool",
          default: "True",
          required: false,
          desc: "If True, displays. If False, returns Figure."
        }
      ],

      returns: {
        type: "None | matplotlib.figure.Figure",
        desc: "None if displayed, Figure if `display=False`."
      },

      raises: [
        {
          exception: "LineSightShapeError",
          condition: "X has more than 1 feature",
          message: "\"plot_sensitivity_analysis() requires single-feature X.\""
        },
        {
          exception: "LineSightShapeError",
          condition: "n < 5",
          message: "\"plot_sensitivity_analysis() requires at least 5 samples.\""
        }
      ],

      warns: [
        {
          warning: "LineSightDataWarning",
          condition: "n > 500",
          message: "\"Fitting {n} leave-one-out models may be slow.\""
        }
      ],

      internalSteps: [
        "Check fitted, validate data, verify 1 feature",
        "Check minimum sample requirement (≥ 5)",
        "Warn if large dataset",
        "For each point i: create boolean mask excluding i, train temp model",
        "Record slope for each leave-one-out model",
        "Compute influence score: |slope_original - slope_without_i|",
        "Rank by influence, select top_n",
        "Left plot: gray LOO lines + blue original + red influential points",
        "Right plot: bar chart of influence scores"
      ],

      mathFormula: `Influence_i = |slope_original - slope_without_i|

For each i:
  Train on X[mask], y[mask] where mask[i] = False
  Record slope_without_i
  Influence = |Δslope|`,

      example: `model.fit(X, y)

# Default: highlight top 3
model.plot_sensitivity_analysis(X, y)

# Highlight top 5 influential points
model.plot_sensitivity_analysis(X, y, top_n=5)

# For large datasets, use a subset
model.plot_sensitivity_analysis(X[:100], y[:100])`,

      inputExample: `# After fitting:
model.plot_sensitivity_analysis(X, y, top_n=3)`,

      outputExample: `# Displays a 2-panel figure:
#
# LEFT panel: Leave-one-out regression lines
#   • Gray lines: regression fitted without each point
#   • Blue line: original fitted line
#   • Red circles: top 3 most influential points
#   • Labels: "#42 (influence: 0.184)"
#
# RIGHT panel: Influence bar chart
#   • Gray bars: influence score per sample
#   • Red bars: top 3 most influential
#   • X-axis: Sample index
#   • Y-axis: |slope_original - slope_without_i|
#
# Influential points ≠ outliers (an extreme on-line
# point can be very influential without being an error)

# Return: None (displayed) or Figure (display=False)`,

      seeAlso: ["plot_fit", "plot_residuals", "plot_gradient_vectors"]
    }
  }
};
